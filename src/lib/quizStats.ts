const STORAGE_KEY = "quiz-stats-v1";

export type QuizStats = {
  /** Верный ответ в тесте с вариантами */
  mcqCorrect: number;
  /** Неверный ответ в тесте с вариантами */
  mcqWrong: number;
  /** Карточки: нажали «Знал ответ» после просмотра */
  trainerKnow: number;
  /** Карточки: нажали «Не знал» */
  trainerMiss: number;
};

export function emptyStats(): QuizStats {
  return {
    mcqCorrect: 0,
    mcqWrong: 0,
    trainerKnow: 0,
    trainerMiss: 0,
  };
}

export function notifyQuizStatsChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("quiz-stats-changed"));
}

function notifyStatsChanged() {
  notifyQuizStatsChanged();
}

export function loadStats(): QuizStats {
  if (typeof window === "undefined") return emptyStats();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStats();
    const parsed = JSON.parse(raw) as Partial<QuizStats>;
    return {
      mcqCorrect: Number(parsed.mcqCorrect) || 0,
      mcqWrong: Number(parsed.mcqWrong) || 0,
      trainerKnow: Number(parsed.trainerKnow) || 0,
      trainerMiss: Number(parsed.trainerMiss) || 0,
    };
  } catch {
    return emptyStats();
  }
}

export function saveStats(stats: QuizStats): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    notifyStatsChanged();
  } catch {
    /* ignore quota */
  }
}

/** 1 балл за каждый успешный ответ (MCQ верно + карточка «знал»). */
export function totalScore(stats: QuizStats): number {
  return stats.mcqCorrect + stats.trainerKnow;
}

export function totalSuccess(stats: QuizStats): number {
  return stats.mcqCorrect + stats.trainerKnow;
}

export function totalFail(stats: QuizStats): number {
  return stats.mcqWrong + stats.trainerMiss;
}

/** После сохранения ответа в БД (см. `/api/mcq/verify`) — перезагрузить панель баллов. */
export function recordMcqResult(): void {
  notifyQuizStatsChanged();
}

/** Тренажёр пишет прогресс в `/api/questions/grade`; вызовите после успешного ответа сервера. */
export function recordTrainerSelfGradeSynced(): void {
  notifyQuizStatsChanged();
}

export function resetStats(): void {
  saveStats(emptyStats());
}
