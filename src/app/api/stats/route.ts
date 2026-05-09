import { NextResponse } from "next/server";
import { getQuizDeviceId } from "@/lib/quizDeviceServer";
import { prisma } from "@/lib/prisma";

/** Агрегаты по сохранённым ответам (MCQ и тренажёр) для этого устройства. */
export async function GET(request: Request) {
  try {
    const deviceId = getQuizDeviceId(request);
    if (!deviceId) {
      return NextResponse.json(
        { error: "Нужен заголовок X-Quiz-Device-Id." },
        { status: 400 },
      );
    }

    const [mcqCorrect, mcqWrong, trainerKnow, trainerMiss] = await Promise.all([
      prisma.mcqQuestionProgress.count({
        where: { deviceId, lastCorrect: true },
      }),
      prisma.mcqQuestionProgress.count({
        where: { deviceId, lastCorrect: false },
      }),
      prisma.trainerQuestionProgress.count({
        where: { deviceId, knewAnswer: true },
      }),
      prisma.trainerQuestionProgress.count({
        where: { deviceId, knewAnswer: false },
      }),
    ]);

    return NextResponse.json({
      mcqCorrect,
      mcqWrong,
      trainerKnow,
      trainerMiss,
    });
  } catch {
    return NextResponse.json({ error: "Не удалось загрузить статистику." }, { status: 500 });
  }
}
