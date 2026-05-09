import { NextResponse } from "next/server";
import { getQuizDeviceId } from "@/lib/quizDeviceServer";
import { prisma } from "@/lib/prisma";

/** Прогресс по карточкам тренажёра: суммы по теме и статус по id вопроса. */
export async function GET(request: Request) {
  try {
    const deviceId = getQuizDeviceId(request);
    if (!deviceId) {
      return NextResponse.json(
        { error: "Нужен заголовок X-Quiz-Device-Id." },
        { status: 400 },
      );
    }

    const [questions, progress] = await Promise.all([
      prisma.question.findMany({ select: { id: true, topic: true } }),
      prisma.trainerQuestionProgress.findMany({
        where: { deviceId },
        select: { questionId: true, knewAnswer: true },
      }),
    ]);

    const byQuestionId: Record<number, "ok" | "bad"> = {};
    for (const p of progress) {
      byQuestionId[p.questionId] = p.knewAnswer ? "ok" : "bad";
    }

    const byTopic: Record<string, { ok: number; bad: number }> = {};
    for (const q of questions) {
      if (!byTopic[q.topic]) byTopic[q.topic] = { ok: 0, bad: 0 };
      const verdict = byQuestionId[q.id];
      if (verdict === "ok") byTopic[q.topic].ok += 1;
      else if (verdict === "bad") byTopic[q.topic].bad += 1;
    }

    return NextResponse.json({ byTopic, byQuestionId });
  } catch {
    return NextResponse.json({ error: "Не удалось загрузить прогресс." }, { status: 500 });
  }
}
