import QuizPageShell from "@/components/QuizPageShell";
import SitePageHeading from "@/components/SitePageHeading";
import TheoryTopicBanner from "@/components/TheoryTopicBanner";
import TheoryCollapsibleSections from "@/components/TheoryCollapsibleSections";
import TheoryPracticeLinks from "@/components/TheoryPracticeLinks";
import { websocketTheoryIntro, websocketTheorySections } from "@/content/theory/websocketTheorySections";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WebSocket — Теория — Quiz",
  description:
    "Handshake, фреймы, отличия от HTTP, применение и пример кода в браузере",
};

export default function WebSocketTheoryPage() {
  return (
    <QuizPageShell maxWidth="xl">
      <Stack spacing={3}>
        <SitePageHeading
          title="WebSocket"
          subtitle="Полнодуплекс поверх TCP: HTTP Upgrade, фреймы и типичные сценарии использования."
        />

        <TheoryTopicBanner slug="websocket" />

        <TheoryPracticeLinks slug="websocket" />

        <Card elevation={0}>
          <CardContent sx={{ p: { xs: 1.25, sm: 2 } }}>
            <TheoryCollapsibleSections
              introMarkdown={websocketTheoryIntro}
              sections={websocketTheorySections}
            />
          </CardContent>
        </Card>
      </Stack>
    </QuizPageShell>
  );
}
