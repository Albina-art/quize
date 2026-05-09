import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/requireUser";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const auth = await requireUser(request);
  if (!auth.ok) return auth.response;
  try {
    const uid = auth.userId;
    const [questions, progress] = await Promise.all([
      prisma.question.findMany({ select: { id: true, topic: true } }),
      prisma.trainerQuestionProgress.findMany({
        where: { userId: uid },
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
