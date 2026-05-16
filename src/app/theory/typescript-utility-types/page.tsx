import QuizPageShell from "@/components/QuizPageShell";
import SitePageHeading from "@/components/SitePageHeading";
import TheoryCollapsibleSections from "@/components/TheoryCollapsibleSections";
import TheoryPracticeLinks from "@/components/TheoryPracticeLinks";
import TheoryTopicBanner from "@/components/TheoryTopicBanner";
import {
  utilityTypesTheoryIntro,
  utilityTypesTheorySections,
} from "@/content/theory/utilityTypesTheorySections";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Утилитарные типы TypeScript — Теория — Quiz",
  description:
    "Partial, Required, Pick, Omit, Record, Exclude, Extract, NonNullable, ReturnType, Parameters",
};

export default function TypeScriptUtilityTypesTheoryPage() {
  return (
    <QuizPageShell maxWidth="xl">
      <Stack spacing={3}>
        <SitePageHeading
          title="Утилитарные типы TypeScript"
          subtitle="Встроенные преобразования типов: объекты, union и сигнатуры функций без ручного копирования полей."
        />

        <TheoryTopicBanner slug="typescript-utility-types" />

        <TheoryPracticeLinks slug="typescript-utility-types" />

        <Card elevation={0}>
          <CardContent sx={{ p: { xs: 1.25, sm: 2 } }}>
            <TheoryCollapsibleSections
              introMarkdown={utilityTypesTheoryIntro}
              sections={utilityTypesTheorySections}
            />
          </CardContent>
        </Card>
      </Stack>
    </QuizPageShell>
  );
}
