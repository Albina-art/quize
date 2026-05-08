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

function notifyStatsChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("quiz-stats-changed"));
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

export function recordMcqResult(correct: boolean): QuizStats {
  const s = loadStats();
  if (correct) s.mcqCorrect += 1;
  else s.mcqWrong += 1;
  saveStats(s);
  return s;
}

export function recordTrainerSelfGrade(knew: boolean): QuizStats {
  const s = loadStats();
  if (knew) s.trainerKnow += 1;
  else s.trainerMiss += 1;
  saveStats(s);
  return s;
}

export function resetStats(): void {
  saveStats(emptyStats());
}
