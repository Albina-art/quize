type ProgressRow = { questionId: number; success: boolean };

/**
 * Пул id для случайного вопроса по теме с учётом прогресса:
 * — есть ошибки → только неверно отвеченные;
 * — все отвечены и ошибок нет → allAnswered;
 * — иначе неотвеченные или все id темы.
 */
export function buildTopicQuestionPool(
  allIds: number[],
  progress: ProgressRow[],
): { pool: number[] } | { allAnswered: true } {
  if (allIds.length === 0) {
    return { pool: [] };
  }

  const byId = new Map(progress.map((p) => [p.questionId, p.success]));
  const badIds = allIds.filter((id) => byId.get(id) === false);
  const unansweredIds = allIds.filter((id) => !byId.has(id));
  const answeredCount = allIds.filter((id) => byId.has(id)).length;

  if (answeredCount === allIds.length) {
    if (badIds.length > 0) return { pool: badIds };
    return { allAnswered: true };
  }

  if (answeredCount > 0) {
    if (badIds.length > 0) return { pool: badIds };
    if (unansweredIds.length > 0) return { pool: unansweredIds };
  }

  return { pool: allIds };
}

export function pickRandomId(pool: number[]): number | null {
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)] ?? null;
}

export const TOPIC_ALL_ANSWERED_MESSAGE = "Вопросы по теме все отвечены.";
