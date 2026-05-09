import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth/session";

/** Для Route Handlers: авторизованный пользователь или 401 JSON. */
export async function requireUser(
  request: Request,
): Promise<{ ok: true; userId: string } | { ok: false; response: NextResponse }> {
  const userId = await getSessionUserId(request);
  if (!userId) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Нужна авторизация." }, { status: 401 }),
    };
  }
  return { ok: true, userId };
}
