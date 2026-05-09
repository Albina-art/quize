import { NextResponse } from "next/server";
import { prismaClientErrorMessage } from "@/lib/prismaHttpError";
import { requireUser } from "@/lib/auth/requireUser";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const auth = await requireUser(request);
  if (!auth.ok) return auth.response;
  try {
    const notes = await prisma.markdownNote.findMany({
      where: { userId: auth.userId },
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
  const auth = await requireUser(request);
  if (!auth.ok) return auth.response;
  try {
    const body = (await request.json()) as {
      title?: unknown;
      body?: unknown;
    };
    const title = String(body?.title ?? "Новая заметка").slice(0, 500);
    const text = String(body?.body ?? "");

    const created = await prisma.markdownNote.create({
      data: { userId: auth.userId, title, body: text },
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
