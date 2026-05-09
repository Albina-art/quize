/** Теория: CORS. Цельный текст собирается из секций (страница использует аккордеоны). */
import { corsTheoryIntro, corsTheorySections } from "@/content/theory/corsTheorySections";

export const corsMarkdown =
  corsTheoryIntro.trimEnd() +
  "\n\n" +
  corsTheorySections.map((s) => `## ${s.title}\n\n${s.body}`).join("\n\n");
