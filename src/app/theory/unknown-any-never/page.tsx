import QuizPageShell from "@/components/QuizPageShell";
import SitePageHeading from "@/components/SitePageHeading";
import TheoryTopicBanner from "@/components/TheoryTopicBanner";
import TheoryCollapsibleSections from "@/components/TheoryCollapsibleSections";
import TheoryPracticeLinks from "@/components/TheoryPracticeLinks";
import {
  unknownAnyNeverTheoryIntro,
  unknownAnyNeverTheorySections,
} from "@/content/theory/unknownAnyNeverTheorySections";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "unknown, any и never — Теория — Quiz",
  description:
    "Разница между any, unknown и never в TypeScript: безопасность, сужение типов и исчерпывающие проверки",
};

export default function UnknownAnyNeverTheoryPage() {
  return (
    <QuizPageShell maxWidth="xl">
      <Stack spacing={3}>
        <SitePageHeading
          title="unknown, any и never"
          subtitle="Три специальных типа TypeScript: когда ослабить проверки, когда заставить их проходить и когда описать «пустоту»."
        />

        <TheoryTopicBanner slug="unknown-any-never" />

        <TheoryPracticeLinks slug="unknown-any-never" />

        <Card elevation={0}>
          <CardContent sx={{ p: { xs: 1.25, sm: 2 } }}>
            <TheoryCollapsibleSections
              introMarkdown={unknownAnyNeverTheoryIntro}
              sections={unknownAnyNeverTheorySections}
            />
          </CardContent>
        </Card>
      </Stack>
    </QuizPageShell>
  );
}
