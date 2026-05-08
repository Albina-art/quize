import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const topicRaw = searchParams.get("topic");
    const topic =
      topicRaw !== null && topicRaw.trim() !== "" ? topicRaw.trim() : undefined;

    const where = topic ? { topic } : {};

    const total = await prisma.question.count({ where });

    if (total === 0) {
      const emptyMessage = topic
        ? `Нет вопросов по теме «${topic}».`
        : "База вопросов пока пустая.";
      return NextResponse.json({ error: emptyMessage }, { status: 404 });
    }

    const randomIndex = Math.floor(Math.random() * total);
    const [item] = await prisma.question.findMany({
      where,
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
