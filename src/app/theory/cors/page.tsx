import MarkdownArticle from "@/components/MarkdownArticle";
import QuizPageShell from "@/components/QuizPageShell";
import SiteHeader from "@/components/SiteHeader";
import TheoryNavLink from "@/components/TheoryNavLink";
import { corsMarkdown } from "@/content/theory/corsMarkdown";
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
        <SiteHeader
          title="CORS"
          subtitle="Как браузер разрешает скриптам с одного сайта обращаться к API на другом — и когда запрос блокируется."
        />

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
            <MarkdownArticle source={corsMarkdown} />
          </CardContent>
        </Card>
      </Stack>
    </QuizPageShell>
  );
}
