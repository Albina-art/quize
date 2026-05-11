/**
 * Цельный текст конспекта (для поиска / копирования).
 * Страница `/theory/jwt` использует `jwtTheorySections` и аккордеоны.
 */
import { jwtTheoryIntro, jwtTheorySections } from "@/content/theory/jwtTheorySections";

export const jwtMarkdown =
  jwtTheoryIntro.trimEnd() +
  "\n\n" +
  jwtTheorySections.map((s) => `## ${s.title}\n\n${s.body}`).join("\n\n");
