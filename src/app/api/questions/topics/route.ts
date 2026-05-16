import { NextResponse } from "next/server";
import { prismaClientErrorMessage } from "@/lib/prismaHttpError";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: Request) {
  try {
    const topic = new URL(request.url).searchParams.get("topic")?.trim();
    if (!topic) {
      return NextResponse.json({ error: "Укажите параметр topic." }, { status: 400 });
    }

    const { count } = await prisma.question.deleteMany({ where: { topic } });
    if (count === 0) {
      return NextResponse.json(
        { error: `Нет вопросов по теме «${topic}».` },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true, deleted: count });
  } catch (e) {
    console.error("[DELETE /api/questions/topics]", e);
    return NextResponse.json(
      { error: prismaClientErrorMessage("Не удалось удалить тему.", e) },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const rows = await prisma.question.findMany({
      distinct: ["topic"],
      select: { topic: true },
      orderBy: { topic: "asc" },
    });

    const topics = rows.map((r) => r.topic);
    return NextResponse.json({ topics });
  } catch {
    return NextResponse.json(
      { error: "Не удалось загрузить список тем." },
      { status: 500 },
    );
  }
}
