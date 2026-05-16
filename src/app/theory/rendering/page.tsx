import QuizPageShell from "@/components/QuizPageShell";
import SitePageHeading from "@/components/SitePageHeading";
import TheoryPracticeLinks from "@/components/TheoryPracticeLinks";
import TheoryTopicBanner from "@/components/TheoryTopicBanner";
import TheoryCollapsibleSections from "@/components/TheoryCollapsibleSections";
import {
  renderingTheoryIntro,
  renderingTheorySections,
} from "@/content/theory/renderingTheorySections";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Рендеринг: CRP в браузере и фазы React — Теория — Quiz",
  description:
    "Critical Rendering Path (DOM, CSSOM, layout, paint), Fiber, Render и Commit, хуки, DOMContentLoaded и монтирование приложения.",
};

export default function RenderingTheoryPage() {
  return (
    <QuizPageShell maxWidth="xl">
      <Stack spacing={3}>
        <SitePageHeading
          title="Рендеринг в браузере и React"
          subtitle="Критический путь от HTML до пикселей, фазы Fiber и связь с DOMContentLoaded."
        />

        <TheoryTopicBanner slug="rendering" />

        <TheoryPracticeLinks slug="rendering" />

        <Card elevation={0}>
          <CardContent sx={{ p: { xs: 1.25, sm: 2 } }}>
            <TheoryCollapsibleSections
              introMarkdown={renderingTheoryIntro}
              sections={renderingTheorySections}
            />
          </CardContent>
        </Card>
      </Stack>
    </QuizPageShell>
  );
}
