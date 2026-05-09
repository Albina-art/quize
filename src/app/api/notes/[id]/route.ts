import { NextResponse } from "next/server";
import { prismaClientErrorMessage } from "@/lib/prismaHttpError";
import { requireUser } from "@/lib/auth/requireUser";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, ctx: RouteContext) {
  const auth = await requireUser(request);
  if (!auth.ok) return auth.response;
  try {
    const { id } = await ctx.params;
    if (!id) {
      return NextResponse.json({ error: "Нужен id." }, { status: 400 });
    }

    const body = (await request.json()) as {
      title?: unknown;
      body?: unknown;
    };

    const note = await prisma.markdownNote.findFirst({
      where: { id, userId: auth.userId },
      select: { id: true },
    });
    if (!note) {
      return NextResponse.json({ error: "Заметка не найдена." }, { status: 404 });
    }

    const data: { title?: string; body?: string } = {};
    if (body.title !== undefined) data.title = String(body.title).slice(0, 500);
    if (body.body !== undefined) data.body = String(body.body);

    const updated = await prisma.markdownNote.update({
      where: { id },
      data,
    });

    return NextResponse.json(updated);
  } catch (e) {
    console.error("[PATCH /api/notes]", e);
    return NextResponse.json(
      { error: prismaClientErrorMessage("Не удалось обновить заметку.", e) },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request, ctx: RouteContext) {
  const auth = await requireUser(request);
  if (!auth.ok) return auth.response;
  try {
    const { id } = await ctx.params;
    if (!id) {
      return NextResponse.json({ error: "Нужен id." }, { status: 400 });
    }

    const note = await prisma.markdownNote.findFirst({
      where: { id, userId: auth.userId },
      select: { id: true },
    });
    if (!note) {
      return NextResponse.json({ error: "Заметка не найдена." }, { status: 404 });
    }

    await prisma.markdownNote.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[DELETE /api/notes]", e);
    return NextResponse.json(
      { error: prismaClientErrorMessage("Не удалось удалить заметку.", e) },
      { status: 500 },
    );
  }
}
