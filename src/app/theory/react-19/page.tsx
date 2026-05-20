import QuizPageShell from "@/components/QuizPageShell";
import SitePageHeading from "@/components/SitePageHeading";
import TheoryCollapsibleSections from "@/components/TheoryCollapsibleSections";
import TheoryPracticeLinks from "@/components/TheoryPracticeLinks";
import TheoryTopicBanner from "@/components/TheoryTopicBanner";
import {
  react19TheoryIntro,
  react19TheorySections,
} from "@/content/theory/react19TheorySections";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Нововведения React 19 — Теория — Quiz",
  description:
    "Actions, useActionState, useFormStatus, useOptimistic, хук use, Suspense, ref без forwardRef, метатеги, React Compiler, Server Actions",
};

export default function React19TheoryPage() {
  return (
    <QuizPageShell maxWidth="xl">
      <Stack spacing={3}>
        <SitePageHeading
          title="Нововведения React 19"
          subtitle="Формы и асинхронные действия, хук use, Suspense, упрощение ref, метаданные в дереве, компилятор и серверная модель."
        />

        <TheoryTopicBanner slug="react-19" />

        <TheoryPracticeLinks slug="react-19" />

        <Card elevation={0}>
          <CardContent sx={{ p: { xs: 1.25, sm: 2 } }}>
            <TheoryCollapsibleSections
              introMarkdown={react19TheoryIntro}
              sections={react19TheorySections}
            />
          </CardContent>
        </Card>
      </Stack>
    </QuizPageShell>
  );
}
