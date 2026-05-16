import { NextResponse } from "next/server";
import { prismaClientErrorMessage } from "@/lib/prismaHttpError";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, ctx: RouteContext) {
  try {
    const { id: raw } = await ctx.params;
    const id = Number(raw);
    if (!Number.isFinite(id) || id <= 0) {
      return NextResponse.json({ error: "Нужен корректный id." }, { status: 400 });
    }

    const existing = await prisma.question.findFirst({
      where: { id },
      select: { id: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Вопрос не найден." }, { status: 404 });
    }

    await prisma.question.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[DELETE /api/questions]", e);
    return NextResponse.json(
      { error: prismaClientErrorMessage("Не удалось удалить вопрос.", e) },
      { status: 500 },
    );
  }
}
