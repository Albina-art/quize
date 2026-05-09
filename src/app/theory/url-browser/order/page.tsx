import type { Metadata } from "next";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import QuizPageShell from "@/components/QuizPageShell";
import TheoryNavLink from "@/components/TheoryNavLink";
import SiteHeader from "@/components/SiteHeader";
import TheoryTopicBanner from "@/components/TheoryTopicBanner";
import UrlBrowserOrderQuiz from "@/components/UrlBrowserOrderQuiz";

export const metadata: Metadata = {
  title: "Порядок этапов — URL и браузер — Quiz",
  description:
    "Расставьте по порядку: DNS, TCP, HTTPS, сервер, отрисовка страницы",
};

export default function UrlBrowserOrderPage() {
  return (
    <QuizPageShell>
      <Stack spacing={3}>
        <SiteHeader
          title="Порядок шагов при вводе URL"
          subtitle="Та же тема, что в статье — только перетащите этапы в правильную последовательность."
        />

        <TheoryTopicBanner slug="url-browser" />

        <Typography variant="body2">
          <TheoryNavLink href="/theory/url-browser" underline="hover" color="secondary">
            ← К статье «Что происходит при вводе URL»
          </TheoryNavLink>
        </Typography>

        <Card elevation={0}>
          <CardContent sx={{ p: { xs: 1.25, sm: 2 } }}>
            <UrlBrowserOrderQuiz />
          </CardContent>
        </Card>
      </Stack>
    </QuizPageShell>
  );
}
