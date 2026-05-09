import { NextResponse } from "next/server";
import { getQuizDeviceId } from "@/lib/quizDeviceServer";
import { prismaClientErrorMessage } from "@/lib/prismaHttpError";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const deviceId = getQuizDeviceId(request);
    if (!deviceId) {
      return NextResponse.json(
        { error: "Нужен заголовок X-Quiz-Device-Id." },
        { status: 400 },
      );
    }

    const notes = await prisma.markdownNote.findMany({
      where: { deviceId },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ notes });
  } catch (e) {
    console.error("[GET /api/notes]", e);
    return NextResponse.json(
      { error: prismaClientErrorMessage("Не удалось загрузить заметки.", e) },
      { status: 500 },
    );
  }
}

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
      title?: unknown;
      body?: unknown;
    };
    const title = String(body?.title ?? "Новая заметка").slice(0, 500);
    const text = String(body?.body ?? "");

    const created = await prisma.markdownNote.create({
      data: { deviceId, title, body: text },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    console.error("[POST /api/notes]", e);
    return NextResponse.json(
      { error: prismaClientErrorMessage("Не удалось создать заметку.", e) },
      { status: 500 },
    );
  }
}
