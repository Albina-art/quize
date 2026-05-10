import QuizPageShell from "@/components/QuizPageShell";
import SitePageHeading from "@/components/SitePageHeading";
import TheoryCollapsibleSections from "@/components/TheoryCollapsibleSections";
import TheoryNavLink from "@/components/TheoryNavLink";
import TheoryTopicBanner from "@/components/TheoryTopicBanner";
import {
  reactTypesTheoryIntro,
  reactTypesTheorySections,
} from "@/content/theory/reactTypesTheorySections";
import { mcqUrlForTheorySlug } from "@/content/theory/topics";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Типы React и TypeScript — Теория — Quiz",
  description:
    "FC, PropsWithChildren, ReactNode, события, useState, useRef, CSSProperties, контекст",
};

const mcqTestHref = mcqUrlForTheorySlug("react-typescript-types");

export default function ReactTypeScriptTypesTheoryPage() {
  return (
    <QuizPageShell maxWidth="xl">
      <Stack spacing={3}>
        <SitePageHeading
          title="Типы React и TypeScript"
          subtitle="Компоненты, события, ref, состояние и контекст: типы из React для статической проверки JSX и хуков."
        />

        <TheoryTopicBanner slug="react-typescript-types" />

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
              introMarkdown={reactTypesTheoryIntro}
              sections={reactTypesTheorySections}
            />
          </CardContent>
        </Card>
      </Stack>
    </QuizPageShell>
  );
}
