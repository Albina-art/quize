import { getOrCreateQuizDeviceId, QUIZ_DEVICE_HEADER } from "@/lib/quizDeviceId";

/** fetch с заголовком устройства для API прогресса и заметок. */
export async function quizFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const id = getOrCreateQuizDeviceId();
  const headers = new Headers(init?.headers ?? undefined);
  if (id && !headers.has(QUIZ_DEVICE_HEADER)) {
    headers.set(QUIZ_DEVICE_HEADER, id);
  }
  return fetch(input, { ...init, headers });
}
