"use client";

import QuizPageShell from "@/components/QuizPageShell";
import SiteHeader from "@/components/SiteHeader";
import { mcqUrlForTheorySlug, theoryTopics } from "@/content/theory/topics";
import FactCheckRoundedIcon from "@mui/icons-material/FactCheckRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";

export default function TheoryIndexPage() {
  return (
    <QuizPageShell maxWidth="xl">
      <Stack spacing={3}>
        <SiteHeader
          title="Теория"
          subtitle="Конспекты по темам: можно читать перед тренировкой по карточкам."
        />

        <Stack spacing={2}>
          {theoryTopics.map((topic) => {
            const mcqHref = mcqUrlForTheorySlug(topic.slug);
            return (
              <Card key={topic.slug} elevation={0}>
                <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                  <Stack spacing={1.75}>
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
                      direction={{ xs: "column", sm: "row" }}
                      spacing={1.25}
                      sx={{ pt: 0.5 }}
                    >
                      <Button
                        component={Link}
                        href={`/theory/${topic.slug}`}
                        variant="contained"
                        color="secondary"
                        size="medium"
                        startIcon={<MenuBookRoundedIcon />}
                        sx={{ justifyContent: "center", textTransform: "none", fontWeight: 600 }}
                      >
                        Читать конспект
                      </Button>
                      {mcqHref ? (
                        <Button
                          component={Link}
                          href={mcqHref}
                          variant="outlined"
                          color="inherit"
                          size="medium"
                          startIcon={<FactCheckRoundedIcon />}
                          sx={{ justifyContent: "center", textTransform: "none", fontWeight: 600 }}
                        >
                          Тест по теме
                        </Button>
                      ) : null}
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      </Stack>
    </QuizPageShell>
  );
}
