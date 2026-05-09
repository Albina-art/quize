/** Должен совпадать с заголовком в `quizDeviceId.ts` (клиент). */
export const QUIZ_DEVICE_HEADER = "x-quiz-device-id";

function isValidDeviceId(raw: string): boolean {
  if (raw.length < 16 || raw.length > 128) return false;
  return /^[\w.\-]+$/.test(raw);
}

export function getQuizDeviceId(request: Request): string | null {
  const raw = request.headers.get(QUIZ_DEVICE_HEADER)?.trim();
  if (!raw || !isValidDeviceId(raw)) return null;
  return raw;
}
