import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import {
  cookieOptions,
  isSessionSecretConfigured,
  SESSION_COOKIE,
  signSessionToken,
} from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function POST(request: Request) {
  try {
    if (!isSessionSecretConfigured()) {
      console.error("[POST /api/auth/login] SESSION_SECRET missing or shorter than 16 chars");
      return NextResponse.json(
        {
          error:
            process.env.NODE_ENV === "production"
              ? "Сервер не настроен для входа."
              : "Укажите SESSION_SECRET не короче 16 символов в .env или .env.local и перезапустите dev-сервер.",
        },
        { status: 503 },
      );
    }

    const body = (await request.json()) as {
      email?: unknown;
      password?: unknown;
    };
    const email = normalizeEmail(String(body?.email ?? ""));
    const password = String(body?.password ?? "");

    if (!email || !password) {
      return NextResponse.json(
        { error: "Нужны email и пароль." },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, passwordHash: true },
    });
    if (!user) {
      return NextResponse.json(
        { error: "Неверный email или пароль." },
        { status: 401 },
      );
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json(
        { error: "Неверный email или пароль." },
        { status: 401 },
      );
    }

    const token = await signSessionToken(user.id);
    const res = NextResponse.json({
      user: { id: user.id, email: user.email },
    });
    res.cookies.set(SESSION_COOKIE, token, cookieOptions());
    return res;
  } catch (e) {
    console.error("[POST /api/auth/login]", e);
    return NextResponse.json({ error: "Не удалось войти." }, { status: 500 });
  }
}
