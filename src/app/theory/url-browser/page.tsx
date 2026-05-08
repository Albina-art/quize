import type { Metadata } from "next";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import MarkdownArticle from "@/components/MarkdownArticle";
import TheoryNavLink from "@/components/TheoryNavLink";
import QuizPageShell from "@/components/QuizPageShell";
import SiteHeader from "@/components/SiteHeader";
import { urlBrowserMarkdown } from "@/content/theory/urlBrowserMarkdown";

export const metadata: Metadata = {
  title: "URL и браузер — Теория — Quiz",
  description: "DNS, TCP, HTTPS и путь запроса от адресной строки до экрана",
};

export default function UrlBrowserTheoryPage() {
  return (
    <QuizPageShell maxWidth="lg">
      <Stack spacing={3}>
        <SiteHeader
          title="Что происходит при вводе URL"
          subtitle="От DNS и TCP до HTTPS, веб-сервера и отрисовки страницы."
        />

        <Typography variant="body1">
          <TheoryNavLink
            href="/theory/url-browser/order"
            underline="hover"
            sx={{ fontWeight: 600 }}
          >
            Упражнение: расставить этапы по порядку (drag & drop)
          </TheoryNavLink>
        </Typography>

        <Card elevation={0}>
          <CardContent sx={{ p: { xs: 1.25, sm: 2 } }}>
            <MarkdownArticle source={urlBrowserMarkdown} />
          </CardContent>
        </Card>
      </Stack>
    </QuizPageShell>
  );
}
