import QuizPageShell from "@/components/QuizPageShell";
import SitePageHeading from "@/components/SitePageHeading";
import TheoryCollapsibleSections from "@/components/TheoryCollapsibleSections";
import TheoryPracticeLinks from "@/components/TheoryPracticeLinks";
import TheoryTopicBanner from "@/components/TheoryTopicBanner";
import {
  jsClosuresTheoryIntro,
  jsClosuresTheorySections,
} from "@/content/theory/jsClosuresTheorySections";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Замыкания в JavaScript — Теория — Quiz",
  description:
    "Лексическое окружение, var и let в циклах, IIFE, модульный паттерн и память",
};

export default function JavaScriptClosuresTheoryPage() {
  return (
    <QuizPageShell maxWidth="xl">
      <Stack spacing={3}>
        <SitePageHeading
          title="Замыкания в JavaScript"
          subtitle="Как функции запоминают внешние переменные: циклы, таймеры, приватность и модули."
        />

        <TheoryTopicBanner slug="javascript-closures" />

        <TheoryPracticeLinks slug="javascript-closures" />

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
