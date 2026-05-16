import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/requireUser";
import { prisma } from "@/lib/prisma";
import {
  buildTopicQuestionPool,
  pickRandomId,
  TOPIC_ALL_ANSWERED_MESSAGE,
} from "@/lib/topicQuestionPool";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const topicRaw = searchParams.get("topic");
    const topic =
      topicRaw !== null && topicRaw.trim() !== "" ? topicRaw.trim() : undefined;
    const retake = searchParams.get("retake") === "1";

    const where = topic ? { topic } : {};

    const total = await prisma.question.count({ where });

    if (total === 0) {
      const emptyMessage = topic
        ? `Нет вопросов по теме «${topic}».`
        : "База вопросов пока пустая.";
      return NextResponse.json({ error: emptyMessage }, { status: 404 });
    }

    let questionId: number | null = null;

    if (topic) {
      const auth = await requireUser(request);
      if (!auth.ok) return auth.response;

      const rows = await prisma.question.findMany({
        where: { topic },
        select: { id: true },
      });
      const allIds = rows.map((r) => r.id);

      const progressRows = await prisma.trainerQuestionProgress.findMany({
        where: { userId: auth.userId, questionId: { in: allIds } },
        select: { questionId: true, knewAnswer: true },
      });

      if (retake) {
        questionId = pickRandomId(allIds);
      } else {
        const poolResult = buildTopicQuestionPool(
          allIds,
          progressRows.map((p) => ({ questionId: p.questionId, success: p.knewAnswer })),
        );

        if ("allAnswered" in poolResult) {
          return NextResponse.json(
            { error: TOPIC_ALL_ANSWERED_MESSAGE, code: "TOPIC_ALL_ANSWERED" },
            { status: 404 },
          );
        }

        questionId = pickRandomId(poolResult.pool);
      }
    } else {
      const randomIndex = Math.floor(Math.random() * total);
      const [row] = await prisma.question.findMany({
        where,
        skip: randomIndex,
        take: 1,
        orderBy: { id: "asc" },
        select: { id: true },
      });
      questionId = row?.id ?? null;
    }

    if (questionId === null) {
      return NextResponse.json(
        { error: "Не удалось получить случайный вопрос." },
        { status: 500 },
      );
    }

    const item = await prisma.question.findFirst({
      where: { id: questionId },
    });

    if (!item) {
      return NextResponse.json(
        { error: "Не удалось получить случайный вопрос." },
        { status: 500 },
      );
    }

    return NextResponse.json(item);
  } catch {
    return NextResponse.json(
      { error: "Не удалось получить случайный вопрос." },
      { status: 500 },
    );
  }
}
