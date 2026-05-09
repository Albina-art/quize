/**
 * Цельный текст конспекта (для поиска / копирования).
 * Страница `/theory/https-tls` использует `httpsTlsTheorySections` и аккордеоны.
 */
import {
  httpsTlsTheoryIntro,
  httpsTlsTheorySections,
} from "@/content/theory/httpsTlsTheorySections";

export const httpsTlsMarkdown =
  httpsTlsTheoryIntro.trimEnd() +
  "\n\n" +
  httpsTlsTheorySections.map((s) => `## ${s.title}\n\n${s.body}`).join("\n\n");
