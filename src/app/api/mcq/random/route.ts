import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    const where = topic ? { topic } : {};

    const total = await prisma.mcqQuestion.count({ where });

    if (total === 0) {
      const emptyMessage = topic
        ? `Нет тестовых вопросов по теме «${topic}».`
        : "Тестовые вопросы с вариантами пока не добавлены.";
      return NextResponse.json({ error: emptyMessage }, { status: 404 });
    }

    const randomIndex = Math.floor(Math.random() * total);
    const [item] = await prisma.mcqQuestion.findMany({
      where,
      skip: randomIndex,
      take: 1,
      orderBy: { id: "asc" },
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
