import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const topic = String(body?.topic ?? "").trim();
    const question = String(body?.question ?? "").trim();
    const answer = String(body?.answer ?? "").trim();
    const hintRaw = body?.hint;
    const hint =
      hintRaw === undefined || hintRaw === null
        ? undefined
        : String(hintRaw).trim() || null;

    if (!topic || !question || !answer) {
      return NextResponse.json(
        { error: "Поля topic, question и answer обязательны." },
        { status: 400 },
      );
    }

    const created = await prisma.question.create({
      data: { topic, question, answer, hint },
    });

    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Не удалось сохранить вопрос." }, { status: 500 });
  }
}
