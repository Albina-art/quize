import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/requireUser";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const auth = await requireUser(request);
  if (!auth.ok) return auth.response;
  try {
    const body = (await request.json()) as {
      questionId?: unknown;
      optionId?: unknown;
    };

    const questionId = Number(body?.questionId);
    const optionId = Number(body?.optionId);

    if (
      !Number.isFinite(questionId) ||
      questionId <= 0 ||
      !Number.isFinite(optionId) ||
      optionId <= 0
    ) {
      return NextResponse.json(
        { error: "Нужны корректные questionId и optionId." },
        { status: 400 },
      );
    }

    const selected = await prisma.mcqOption.findFirst({
      where: { id: optionId, questionId },
      select: { isCorrect: true },
    });

    if (!selected) {
      return NextResponse.json(
        { error: "Вариант не найден для этого вопроса." },
        { status: 404 },
      );
    }

    const correct = await prisma.mcqOption.findFirst({
      where: { questionId, isCorrect: true },
      select: { id: true },
    });

    const lastCorrect = selected.isCorrect;

    await prisma.mcqQuestionProgress.upsert({
      where: {
        userId_questionId: { userId: auth.userId, questionId },
      },
      create: { userId: auth.userId, questionId, lastCorrect },
      update: { lastCorrect },
    });

    return NextResponse.json({
      correct: lastCorrect,
      correctOptionId: correct?.id ?? null,
    });
  } catch {
    return NextResponse.json(
      { error: "Не удалось проверить ответ." },
      { status: 500 },
    );
  }
}
