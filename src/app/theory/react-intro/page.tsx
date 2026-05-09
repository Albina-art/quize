import QuizPageShell from "@/components/QuizPageShell";
import SiteHeader from "@/components/SiteHeader";
import TheoryCollapsibleSections from "@/components/TheoryCollapsibleSections";
import TheoryNavLink from "@/components/TheoryNavLink";
import TheoryTopicBanner from "@/components/TheoryTopicBanner";
import {
  reactIntroTheoryIntro,
  reactIntroTheorySections,
} from "@/content/theory/reactIntroTheorySections";
import { mcqUrlForTheorySlug, trainerUrlForTheorySlug } from "@/content/theory/topics";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Что такое React? — Теория — Quiz",
  description:
    "Компоненты, JSX, props, state, Virtual DOM, хуки, React Router и экосистема React",
};

const mcqTestHref = mcqUrlForTheorySlug("react-intro");
const trainerHref = trainerUrlForTheorySlug("react-intro");

export default function ReactIntroTheoryPage() {
  return (
    <QuizPageShell maxWidth="xl">
      <Stack spacing={3}>
        <SiteHeader
          title="Что такое React?"
          subtitle="Библиотека для UI от Meta: компоненты, JSX, состояние, виртуальный DOM и хуки."
        />

        <TheoryTopicBanner slug="react-intro" />

        <Stack spacing={1.25}>
          {trainerHref ? (
            <Typography variant="body1">
              <TheoryNavLink
                href={trainerHref}
                underline="hover"
                sx={{ fontWeight: 500, fontSize: "1.25rem" }}
              >
                Тренировка по теме (вопрос с подсказкой и эталонным ответом)
              </TheoryNavLink>
            </Typography>
          ) : null}
          {mcqTestHref ? (
            <Typography variant="body1">
              <TheoryNavLink
                href={mcqTestHref}
                underline="hover"
                sx={{ fontWeight: 500, fontSize: "1.25rem" }}
              >
                Тест с вариантами по этой теме
              </TheoryNavLink>
            </Typography>
          ) : null}
        </Stack>

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
