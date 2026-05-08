import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const rows = await prisma.mcqQuestion.findMany({
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
