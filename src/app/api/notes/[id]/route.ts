import { NextResponse } from "next/server";
import { getQuizDeviceId } from "@/lib/quizDeviceServer";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, ctx: RouteContext) {
  try {
    const deviceId = getQuizDeviceId(request);
    if (!deviceId) {
      return NextResponse.json(
        { error: "Нужен заголовок X-Quiz-Device-Id." },
        { status: 400 },
      );
    }

    const { id } = await ctx.params;
    if (!id) {
      return NextResponse.json({ error: "Нужен id." }, { status: 400 });
    }

    const body = (await request.json()) as {
      title?: unknown;
      body?: unknown;
    };

    const note = await prisma.markdownNote.findFirst({
      where: { id, deviceId },
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
  } catch {
    return NextResponse.json({ error: "Не удалось обновить заметку." }, { status: 500 });
  }
}

export async function DELETE(request: Request, ctx: RouteContext) {
  try {
    const deviceId = getQuizDeviceId(request);
    if (!deviceId) {
      return NextResponse.json(
        { error: "Нужен заголовок X-Quiz-Device-Id." },
        { status: 400 },
      );
    }

    const { id } = await ctx.params;
    if (!id) {
      return NextResponse.json({ error: "Нужен id." }, { status: 400 });
    }

    const note = await prisma.markdownNote.findFirst({
      where: { id, deviceId },
      select: { id: true },
    });
    if (!note) {
      return NextResponse.json({ error: "Заметка не найдена." }, { status: 404 });
    }

    await prisma.markdownNote.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Не удалось удалить заметку." }, { status: 500 });
  }
}
