import QuizPageShell from "@/components/QuizPageShell";
import SitePageHeading from "@/components/SitePageHeading";
import TheoryCollapsibleSections from "@/components/TheoryCollapsibleSections";
import TheoryNavLink from "@/components/TheoryNavLink";
import TheoryTopicBanner from "@/components/TheoryTopicBanner";
import {
  utilityTypesTheoryIntro,
  utilityTypesTheorySections,
} from "@/content/theory/utilityTypesTheorySections";
import { mcqUrlForTheorySlug } from "@/content/theory/topics";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Утилитарные типы TypeScript — Теория — Quiz",
  description:
    "Partial, Required, Pick, Omit, Record, Exclude, Extract, NonNullable, ReturnType, Parameters",
};

const mcqTestHref = mcqUrlForTheorySlug("typescript-utility-types");

export default function TypeScriptUtilityTypesTheoryPage() {
  return (
    <QuizPageShell maxWidth="xl">
      <Stack spacing={3}>
        <SitePageHeading
          title="Утилитарные типы TypeScript"
          subtitle="Встроенные преобразования типов: объекты, union и сигнатуры функций без ручного копирования полей."
        />

        <TheoryTopicBanner slug="typescript-utility-types" />

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
