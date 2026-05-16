import QuizPageShell from "@/components/QuizPageShell";
import SitePageHeading from "@/components/SitePageHeading";
import TheoryCollapsibleSections from "@/components/TheoryCollapsibleSections";
import TheoryPracticeLinks from "@/components/TheoryPracticeLinks";
import TheoryTopicBanner from "@/components/TheoryTopicBanner";
import {
  reactIntroTheoryIntro,
  reactIntroTheorySections,
} from "@/content/theory/reactIntroTheorySections";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Что такое React? — Теория — Quiz",
  description:
    "Компоненты, JSX, props, state, Virtual DOM, хуки, React Router и экосистема React",
};

export default function ReactIntroTheoryPage() {
  return (
    <QuizPageShell maxWidth="xl">
      <Stack spacing={3}>
        <SitePageHeading
          title="Что такое React?"
          subtitle="Библиотека для UI от Meta: компоненты, JSX, состояние, виртуальный DOM и хуки."
        />

        <TheoryTopicBanner slug="react-intro" />

        <TheoryPracticeLinks slug="react-intro" />

        <Card elevation={0}>
          <CardContent sx={{ p: { xs: 1.25, sm: 2 } }}>
            <TheoryCollapsibleSections
              introMarkdown={reactIntroTheoryIntro}
              sections={reactIntroTheorySections}
            />
          </CardContent>
        </Card>
      </Stack>
    </QuizPageShell>
  );
}
