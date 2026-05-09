import MarkdownArticle from "@/components/MarkdownArticle";
import QuizPageShell from "@/components/QuizPageShell";
import SiteHeader from "@/components/SiteHeader";
import TheoryNavLink from "@/components/TheoryNavLink";
import { urlBrowserMarkdown } from "@/content/theory/urlBrowserMarkdown";
import { mcqUrlForTheorySlug } from "@/content/theory/topics";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "URL и браузер — Теория — Quiz",
  description: "DNS, TCP, HTTPS и путь запроса от адресной строки до экрана",
};

const mcqTestHref = mcqUrlForTheorySlug("url-browser");

export default function UrlBrowserTheoryPage() {
  return (
    <QuizPageShell>
      <Stack spacing={3}>
        <SiteHeader
          title="Что происходит при вводе URL"
          subtitle="От DNS и TCP до HTTPS, веб-сервера и отрисовки страницы."
        />

        <Stack spacing={1.25}>
          <Typography variant="body1">
            <TheoryNavLink
              href="/theory/url-browser/order"
              underline="hover"
              sx={{ fontWeight: 500, fontSize: "1.25rem" }}
            >
              Упражнение: расставить этапы по порядку (drag & drop)
            </TheoryNavLink>
          </Typography>
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
            <MarkdownArticle source={urlBrowserMarkdown} />
          </CardContent>
        </Card>
      </Stack>
    </QuizPageShell>
  );
}
