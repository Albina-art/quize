import QuizPageShell from "@/components/QuizPageShell";
import SitePageHeading from "@/components/SitePageHeading";
import TheoryCollapsibleSections from "@/components/TheoryCollapsibleSections";
import TheoryPracticeLinks from "@/components/TheoryPracticeLinks";
import TheoryTopicBanner from "@/components/TheoryTopicBanner";
import {
  reactVirtualDomTheoryIntro,
  reactVirtualDomTheorySections,
} from "@/content/theory/reactVirtualDomTheorySections";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Virtual DOM в React — Теория — Quiz",
  description:
    "Виртуальный DOM, diffing, reconciliation, ключи, производительность и ограничения",
};

export default function ReactVirtualDomTheoryPage() {
  return (
    <QuizPageShell maxWidth="xl">
      <Stack spacing={3}>
        <SitePageHeading
          title="Virtual DOM в React"
          subtitle="Как React описывает UI в памяти, сравнивает деревья и минимизирует правки реального DOM."
        />

        <TheoryTopicBanner slug="react-virtual-dom" />

        <TheoryPracticeLinks slug="react-virtual-dom" />

        <Card elevation={0}>
          <CardContent sx={{ p: { xs: 1.25, sm: 2 } }}>
            <TheoryCollapsibleSections
              introMarkdown={reactVirtualDomTheoryIntro}
              sections={reactVirtualDomTheorySections}
            />
          </CardContent>
        </Card>
      </Stack>
    </QuizPageShell>
  );
}
