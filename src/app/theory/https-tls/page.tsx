import MarkdownArticle from "@/components/MarkdownArticle";
import QuizPageShell from "@/components/QuizPageShell";
import SiteHeader from "@/components/SiteHeader";
import TheoryNavLink from "@/components/TheoryNavLink";
import { httpsTlsMarkdown } from "@/content/theory/httpsTlsMarkdown";
import { mcqUrlForTheorySlug } from "@/content/theory/topics";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HTTPS, SSL и TLS — Теория — Quiz",
  description:
    "TLS Handshake, симметричное и асимметричное шифрование, цели HTTPS",
};

const mcqTestHref = mcqUrlForTheorySlug("https-tls");

export default function HttpsTlsTheoryPage() {
  return (
    <QuizPageShell maxWidth="lg">
      <Stack spacing={3}>
        <SiteHeader
          title="HTTPS, SSL и TLS"
          subtitle="Безопасное соединение в вебе: шифрование, сертификаты и рукопожатие."
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
            <MarkdownArticle source={httpsTlsMarkdown} />
          </CardContent>
        </Card>
      </Stack>
    </QuizPageShell>
  );
}
