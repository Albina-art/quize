import {
  unknownAnyNeverTheoryIntro,
  unknownAnyNeverTheorySections,
} from "@/content/theory/unknownAnyNeverTheorySections";

export const unknownAnyNeverMarkdown =
  unknownAnyNeverTheoryIntro.trimEnd() +
  "\n\n" +
  unknownAnyNeverTheorySections.map((s) => `## ${s.title}\n\n${s.body}`).join("\n\n");
