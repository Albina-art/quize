import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "quiz-session";

/** Без этого вход/регистрация не смогут выдать cookie-сессию. */
export function isSessionSecretConfigured(): boolean {
  const s = process.env.SESSION_SECRET?.trim();
  return Boolean(s && s.length >= 16);
}

function secretKey(): Uint8Array {
  const s = process.env.SESSION_SECRET?.trim();
  if (!s || s.length < 16) {
    throw new Error("SESSION_SECRET must be set (at least 16 characters).");
  }
  return new TextEncoder().encode(s);
}

export async function signSessionToken(userId: string): Promise<string> {
  return await new SignJWT({})
    .setSubject(userId)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey());
}

/** Возвращает id пользователя или null (неверный / просроченный токен). */
export async function verifySessionToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey(), {
      algorithms: ["HS256"],
    });
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}

export function getSessionTokenFromRequest(request: Request): string | null {
  const raw = request.headers.get("cookie");
  if (!raw) return null;
  const name = SESSION_COOKIE + "=";
  const parts = raw.split(";").map((p) => p.trim());
  for (const p of parts) {
    if (!p.startsWith(name)) continue;
    const v = p.slice(name.length).trim();
    try {
      return decodeURIComponent(v);
    } catch {
      return null;
    }
  }
  return null;
}

export async function getSessionUserId(request: Request): Promise<string | null> {
  const raw = getSessionTokenFromRequest(request);
  if (!raw) return null;
  return verifySessionToken(raw);
}

export function cookieOptions(): {
  httpOnly: true;
  secure: boolean;
  sameSite: "lax";
  path: "/";
  maxAge: number;
} {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}
