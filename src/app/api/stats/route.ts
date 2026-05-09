import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/requireUser";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const auth = await requireUser(request);
  if (!auth.ok) return auth.response;
  try {
    const uid = auth.userId;
    const [mcqCorrect, mcqWrong, trainerKnow, trainerMiss] = await Promise.all([
      prisma.mcqQuestionProgress.count({
        where: { userId: uid, lastCorrect: true },
      }),
      prisma.mcqQuestionProgress.count({
        where: { userId: uid, lastCorrect: false },
      }),
      prisma.trainerQuestionProgress.count({
        where: { userId: uid, knewAnswer: true },
      }),
      prisma.trainerQuestionProgress.count({
        where: { userId: uid, knewAnswer: false },
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
