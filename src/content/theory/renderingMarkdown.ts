/**
 * Цельный текст конспекта (для поиска / копирования).
 * Страница `/theory/rendering` использует `renderingTheorySections` и аккордеоны.
 */
import {
  renderingTheoryIntro,
  renderingTheorySections,
} from "@/content/theory/renderingTheorySections";

export const renderingMarkdown =
  renderingTheoryIntro.trimEnd() +
  "\n\n" +
  renderingTheorySections.map((s) => `## ${s.title}\n\n${s.body}`).join("\n\n");
