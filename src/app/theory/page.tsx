"use client";

import QuizPageShell from "@/components/QuizPageShell";
import SiteHeader from "@/components/SiteHeader";
import { theoryTopics } from "@/content/theory/topics";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";

export default function TheoryIndexPage() {
  return (
    <QuizPageShell>
      <Stack spacing={3}>
        <SiteHeader
          title="Теория"
          subtitle="Конспекты по темам: можно читать перед тренировкой по карточкам."
        />

        <Stack spacing={2}>
          {theoryTopics.map((topic) => (
            <Card key={topic.slug} elevation={0}>
              <CardActionArea component={Link} href={`/theory/${topic.slug}`}>
                <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                  <Stack spacing={1}>
                    <Typography
                      variant="h6"
                      component="h2"
                      sx={{ fontSize: "1.4375rem", lineHeight: 1.4, fontWeight: 600 }}
                    >
                      {topic.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ fontSize: "1.25rem", lineHeight: 1.68 }}
                    >
                      {topic.description}
                    </Typography>
                    <Stack
                      spacing={0.5}
                      sx={{
                        flexDirection: "row",
                        alignItems: "center",
                        color: "secondary.main",
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Читать
                      </Typography>
                      <ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />
                    </Stack>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Stack>
      </Stack>
    </QuizPageShell>
  );
}
