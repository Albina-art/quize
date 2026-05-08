import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const total = await prisma.question.count();

    if (total === 0) {
      return NextResponse.json({ error: "База вопросов пока пустая." }, { status: 404 });
    }

    const randomIndex = Math.floor(Math.random() * total);
    const [item] = await prisma.question.findMany({
      skip: randomIndex,
      take: 1,
      orderBy: { id: "asc" },
    });

    return NextResponse.json(item);
  } catch {
    return NextResponse.json(
      { error: "Не удалось получить случайный вопрос." },
      { status: 500 },
    );
  }
}
