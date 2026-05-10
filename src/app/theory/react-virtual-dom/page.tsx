import QuizPageShell from "@/components/QuizPageShell";
import SitePageHeading from "@/components/SitePageHeading";
import TheoryCollapsibleSections from "@/components/TheoryCollapsibleSections";
import TheoryNavLink from "@/components/TheoryNavLink";
import TheoryTopicBanner from "@/components/TheoryTopicBanner";
import {
  reactVirtualDomTheoryIntro,
  reactVirtualDomTheorySections,
} from "@/content/theory/reactVirtualDomTheorySections";
import { mcqUrlForTheorySlug, trainerUrlForTheorySlug } from "@/content/theory/topics";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Virtual DOM в React — Теория — Quiz",
  description:
    "Виртуальный DOM, diffing, reconciliation, ключи, производительность и ограничения",
};

const mcqTestHref = mcqUrlForTheorySlug("react-virtual-dom");
const trainerHref = trainerUrlForTheorySlug("react-virtual-dom");

export default function ReactVirtualDomTheoryPage() {
  return (
    <QuizPageShell maxWidth="xl">
      <Stack spacing={3}>
        <SitePageHeading
          title="Virtual DOM в React"
          subtitle="Как React описывает UI в памяти, сравнивает деревья и минимизирует правки реального DOM."
        />

        <TheoryTopicBanner slug="react-virtual-dom" />

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
              introMarkdown={reactVirtualDomTheoryIntro}
              sections={reactVirtualDomTheorySections}
            />
          </CardContent>
        </Card>
      </Stack>
    </QuizPageShell>
  );
}
