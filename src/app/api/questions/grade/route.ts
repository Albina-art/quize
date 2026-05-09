import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/requireUser";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const auth = await requireUser(request);
  if (!auth.ok) return auth.response;
  try {
    const body = (await request.json()) as {
      questionId?: unknown;
      knew?: unknown;
    };
    const questionId = Number(body?.questionId);
    const knew = Boolean(body?.knew);

    if (!Number.isFinite(questionId) || questionId <= 0) {
      return NextResponse.json({ error: "Нужен корректный questionId." }, { status: 400 });
    }

    const exists = await prisma.question.findFirst({
      where: { id: questionId },
      select: { id: true },
    });
    if (!exists) {
      return NextResponse.json({ error: "Вопрос не найден." }, { status: 404 });
    }

    await prisma.trainerQuestionProgress.upsert({
      where: {
        userId_questionId: { userId: auth.userId, questionId },
      },
      create: { userId: auth.userId, questionId, knewAnswer: knew },
      update: { knewAnswer: knew },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Не удалось сохранить самооценку." }, { status: 500 });
  }
}
