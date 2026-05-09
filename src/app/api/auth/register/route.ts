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

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    if (!isSessionSecretConfigured()) {
      console.error("[POST /api/auth/register] SESSION_SECRET missing or shorter than 16 chars");
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
    const emailRaw = String(body?.email ?? "");
    const password = String(body?.password ?? "");
    const email = normalizeEmail(emailRaw);

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Укажите корректный email." }, { status: 400 });
    }
    if (password.length < 8 || password.length > 128) {
      return NextResponse.json(
        { error: "Пароль: от 8 до 128 символов." },
        { status: 400 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, passwordHash },
      select: { id: true, email: true },
    });

    const token = await signSessionToken(user.id);
    const res = NextResponse.json({ user }, { status: 201 });
    res.cookies.set(SESSION_COOKIE, token, cookieOptions());
    return res;
  } catch (e: unknown) {
    if (
      e &&
      typeof e === "object" &&
      "code" in e &&
      (e as { code?: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Этот email уже зарегистрирован." },
        { status: 409 },
      );
    }
    console.error("[POST /api/auth/register]", e);
    const hint =
      process.env.NODE_ENV !== "production"
        ? " Смотрите лог терминала где запущен next dev — там будет текст ошибки."
        : "";
    return NextResponse.json(
      { error: `Не удалось зарегистрироваться.${hint}` },
      { status: 500 },
    );
  }
}
