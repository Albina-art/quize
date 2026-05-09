import { NextResponse } from "next/server";
import { getQuizDeviceId } from "@/lib/quizDeviceServer";
import { prisma } from "@/lib/prisma";

/** Сохранить самооценку по карточке («знал» / «не знал»). */
export async function POST(request: Request) {
  try {
    const deviceId = getQuizDeviceId(request);
    if (!deviceId) {
      return NextResponse.json(
        { error: "Нужен заголовок X-Quiz-Device-Id." },
        { status: 400 },
      );
    }

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
        deviceId_questionId: { deviceId, questionId },
      },
      create: { deviceId, questionId, knewAnswer: knew },
      update: { knewAnswer: knew },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Не удалось сохранить самооценку." }, { status: 500 });
  }
}
