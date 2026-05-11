import QuizPageShell from "@/components/QuizPageShell";
import SitePageHeading from "@/components/SitePageHeading";
import TheoryTopicBanner from "@/components/TheoryTopicBanner";
import TheoryCollapsibleSections from "@/components/TheoryCollapsibleSections";
import { jwtTheoryIntro, jwtTheorySections } from "@/content/theory/jwtTheorySections";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JWT, Bearer и токены доступа — Теория — Quiz",
  description:
    "JSON Web Token, access и refresh, Bearer как способ передачи, сравнение с сессиями и базовые рекомендации по безопасности.",
};

export default function JwtTheoryPage() {
  return (
    <QuizPageShell maxWidth="xl">
      <Stack spacing={3}>
        <SitePageHeading
          title="JWT, Bearer и авторизация"
          subtitle="Формат токена, заголовок Authorization, access/refresh и отличие от серверных сессий."
        />

        <TheoryTopicBanner slug="jwt" />

        <Card elevation={0}>
          <CardContent sx={{ p: { xs: 1.25, sm: 2 } }}>
            <TheoryCollapsibleSections
              introMarkdown={jwtTheoryIntro}
              sections={jwtTheorySections}
            />
          </CardContent>
        </Card>
      </Stack>
    </QuizPageShell>
  );
}
