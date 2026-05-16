import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/requireUser";
import { prisma } from "@/lib/prisma";
import {
  buildTopicQuestionPool,
  pickRandomId,
  TOPIC_ALL_ANSWERED_MESSAGE,
} from "@/lib/topicQuestionPool";

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i]!;
    a[i] = a[j]!;
    a[j] = t;
  }
  return a;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const topicRaw = searchParams.get("topic");
    const topic =
      topicRaw !== null && topicRaw.trim() !== "" ? topicRaw.trim() : undefined;
    const retake = searchParams.get("retake") === "1";

    const where = topic ? { topic } : {};

    const total = await prisma.mcqQuestion.count({ where });

    if (total === 0) {
      const emptyMessage = topic
        ? `Нет тестовых вопросов по теме «${topic}».`
        : "Тестовые вопросы с вариантами пока не добавлены.";
      return NextResponse.json({ error: emptyMessage }, { status: 404 });
    }

    let questionId: number | null = null;

    if (topic) {
      const auth = await requireUser(request);
      if (!auth.ok) return auth.response;

      const rows = await prisma.mcqQuestion.findMany({
        where: { topic },
        select: { id: true },
      });
      const allIds = rows.map((r) => r.id);

      const progressRows = await prisma.mcqQuestionProgress.findMany({
        where: { userId: auth.userId, questionId: { in: allIds } },
        select: { questionId: true, lastCorrect: true },
      });

      if (retake) {
        questionId = pickRandomId(allIds);
      } else {
        const poolResult = buildTopicQuestionPool(
          allIds,
          progressRows.map((p) => ({ questionId: p.questionId, success: p.lastCorrect })),
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
      const [row] = await prisma.mcqQuestion.findMany({
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
        { error: "Не удалось получить вопрос." },
        { status: 500 },
      );
    }

    const item = await prisma.mcqQuestion.findFirst({
      where: { id: questionId },
      include: {
        options: {
          orderBy: { sortOrder: "asc" },
          select: { id: true, text: true },
        },
      },
    });

    if (!item) {
      return NextResponse.json(
        { error: "Не удалось получить вопрос." },
        { status: 500 },
      );
    }

    const options = shuffle(item.options);

    return NextResponse.json({
      id: item.id,
      topic: item.topic,
      question: item.question,
      hint: item.hint,
      options,
    });
  } catch {
    return NextResponse.json(
      { error: "Не удалось получить вопрос." },
      { status: 500 },
    );
  }
}
