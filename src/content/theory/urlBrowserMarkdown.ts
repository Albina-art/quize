/**
 * Цельный текст конспекта (для поиска / копирования).
 * Страница `/theory/url-browser` использует `urlBrowserTheorySections` и аккордеоны.
 */
import {
  urlBrowserTheoryIntro,
  urlBrowserTheorySections,
} from "@/content/theory/urlBrowserTheorySections";

export const urlBrowserMarkdown =
  urlBrowserTheoryIntro.trimEnd() +
  "\n\n" +
  urlBrowserTheorySections
    .map((s) => `## ${s.title}\n\n${s.body}`)
    .join("\n\n");
