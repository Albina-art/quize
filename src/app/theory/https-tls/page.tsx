import QuizPageShell from "@/components/QuizPageShell";
import SitePageHeading from "@/components/SitePageHeading";
import TheoryTopicBanner from "@/components/TheoryTopicBanner";
import TheoryCollapsibleSections from "@/components/TheoryCollapsibleSections";
import TheoryPracticeLinks from "@/components/TheoryPracticeLinks";
import {
  httpsTlsTheoryIntro,
  httpsTlsTheorySections,
} from "@/content/theory/httpsTlsTheorySections";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HTTPS, SSL и TLS — Теория — Quiz",
  description:
    "TLS Handshake, симметричное и асимметричное шифрование, цели HTTPS",
};

export default function HttpsTlsTheoryPage() {
  return (
    <QuizPageShell maxWidth="xl">
      <Stack spacing={3}>
        <SitePageHeading
          title="HTTPS, SSL и TLS"
          subtitle="Безопасное соединение в вебе: шифрование, сертификаты и рукопожатие."
        />

        <TheoryTopicBanner slug="https-tls" />

        <TheoryPracticeLinks slug="https-tls" />

        <Card elevation={0}>
          <CardContent sx={{ p: { xs: 1.25, sm: 2 } }}>
            <TheoryCollapsibleSections
              introMarkdown={httpsTlsTheoryIntro}
              sections={httpsTlsTheorySections}
            />
          </CardContent>
        </Card>
      </Stack>
    </QuizPageShell>
  );
}
