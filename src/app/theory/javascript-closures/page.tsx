import QuizPageShell from "@/components/QuizPageShell";
import SitePageHeading from "@/components/SitePageHeading";
import TheoryCollapsibleSections from "@/components/TheoryCollapsibleSections";
import TheoryNavLink from "@/components/TheoryNavLink";
import TheoryTopicBanner from "@/components/TheoryTopicBanner";
import {
  jsClosuresTheoryIntro,
  jsClosuresTheorySections,
} from "@/content/theory/jsClosuresTheorySections";
import { mcqUrlForTheorySlug, trainerUrlForTheorySlug } from "@/content/theory/topics";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Замыкания в JavaScript — Теория — Quiz",
  description:
    "Лексическое окружение, var и let в циклах, IIFE, модульный паттерн и память",
};

const mcqTestHref = mcqUrlForTheorySlug("javascript-closures");
const trainerHref = trainerUrlForTheorySlug("javascript-closures");

export default function JavaScriptClosuresTheoryPage() {
  return (
    <QuizPageShell maxWidth="xl">
      <Stack spacing={3}>
        <SitePageHeading
          title="Замыкания в JavaScript"
          subtitle="Как функции запоминают внешние переменные: циклы, таймеры, приватность и модули."
        />

        <TheoryTopicBanner slug="javascript-closures" />

        <Stack spacing={1.25}>
          {trainerHref ? (
            <Typography variant="body1">
              <TheoryNavLink
                href={trainerHref}
                underline="hover"
                sx={{ fontWeight: 500, fontSize: "1.25rem" }}
              >
                Тренировка по теме (развёрнутый ответ)
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
              introMarkdown={jsClosuresTheoryIntro}
              sections={jsClosuresTheorySections}
            />
          </CardContent>
        </Card>
      </Stack>
    </QuizPageShell>
  );
}
