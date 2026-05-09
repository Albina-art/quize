import { websocketTheoryIntro, websocketTheorySections } from "@/content/theory/websocketTheorySections";

export const websocketMarkdown =
  websocketTheoryIntro.trimEnd() +
  "\n\n" +
  websocketTheorySections.map((s) => `## ${s.title}\n\n${s.body}`).join("\n\n");
