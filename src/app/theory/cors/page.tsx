import QuizPageShell from "@/components/QuizPageShell";
import SitePageHeading from "@/components/SitePageHeading";
import TheoryTopicBanner from "@/components/TheoryTopicBanner";
import TheoryCollapsibleSections from "@/components/TheoryCollapsibleSections";
import TheoryNavLink from "@/components/TheoryNavLink";
import { corsTheoryIntro, corsTheorySections } from "@/content/theory/corsTheorySections";
import { mcqUrlForTheorySlug } from "@/content/theory/topics";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CORS — Теория — Quiz",
  description:
    "Cross-Origin Resource Sharing: origin, preflight, заголовки, credentials и безопасность в браузере",
};

const mcqTestHref = mcqUrlForTheorySlug("cors");

export default function CorsTheoryPage() {
  return (
    <QuizPageShell maxWidth="xl">
      <Stack spacing={3}>
        <SitePageHeading
          title="CORS"
          subtitle="Как браузер разрешает скриптам с одного сайта обращаться к API на другом — и когда запрос блокируется."
        />

        <TheoryTopicBanner slug="cors" />

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
            <TheoryCollapsibleSections introMarkdown={corsTheoryIntro} sections={corsTheorySections} />
          </CardContent>
        </Card>
      </Stack>
    </QuizPageShell>
  );
}
