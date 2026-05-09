import { QUIZ_DEVICE_HEADER } from "@/lib/quizDeviceServer";

export { QUIZ_DEVICE_HEADER };

const STORAGE_KEY = "quiz-device-id-v1";

/** Если localStorage заблокирован (приватный режим и т.д.) — хотя бы один id за сессию. */
let memoryFallbackId: string | undefined;

/** UUID устройства/браузера для хранения прогресса и заметок в БД. */
export function getOrCreateQuizDeviceId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = window.localStorage.getItem(STORAGE_KEY);
    if (id && id.length >= 16) return id;
    id = crypto.randomUUID();
    window.localStorage.setItem(STORAGE_KEY, id);
    return id;
  } catch {
    if (!memoryFallbackId) memoryFallbackId = crypto.randomUUID();
    return memoryFallbackId;
  }
}
