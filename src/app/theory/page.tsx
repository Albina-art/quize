"use client";

import QuizPageShell from "@/components/QuizPageShell";
import SitePageHeading from "@/components/SitePageHeading";
import {
  mcqUrlForTheorySlug,
  theoryTopics,
  trainerUrlForTheorySlug,
} from "@/content/theory/topics";
import FactCheckRoundedIcon from "@mui/icons-material/FactCheckRounded";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";

export default function TheoryIndexPage() {
  return (
    <QuizPageShell maxWidth="xl">
      <Stack spacing={3}>
        <SitePageHeading
          title="Теория"
        />

        <Stack spacing={2}>
          {theoryTopics.map((topic) => {
            const mcqHref = mcqUrlForTheorySlug(topic.slug);
            const trainerHref = trainerUrlForTheorySlug(topic.slug);
            return (
              <Card
                key={topic.slug}
                elevation={0}
                sx={{
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 1,
                }}
              >
                <CardActionArea
                  component={Link}
                  href={`/theory/${topic.slug}`}
                  aria-label={`Открыть конспект: ${topic.title}`}
                  sx={{
                    flex: "none",
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: "stretch",
                    width: "100%",
                  }}
                >
                  {topic.illustration ? (
                    <Box
                      sx={{
                        flexShrink: 0,
                        width: { xs: "100%", sm: 200 },
                        alignSelf: { xs: "stretch", sm: "stretch" },
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "action.hover",
                        borderBottom: { xs: 1, sm: "none" },
                        borderRight: { sm: 1 },
                        borderColor: "divider",
                        py: { xs: 2, sm: 2 },
                        px: { xs: 2, sm: 2 },
                        boxSizing: "border-box",
                      }}
                    >
                      <Box
                        component="img"
                        src={topic.illustration}
                        alt=""
                        sx={{
                          width: "100%",
                          height: "auto",
                          maxWidth: 176,
                          maxHeight: { xs: 100, sm: 140 },
                          objectFit: "contain",
                          display: "block",
                        }}
                      />
                    </Box>
                  ) : null}
                  <Box
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      p: { xs: 2, sm: 2.5 },
                      textAlign: "left",
                      boxSizing: "border-box",
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="h2"
                      sx={{
                        fontSize: "1.4375rem",
                        lineHeight: 1.4,
                        fontWeight: 600,
                        color: "darksalmon",
                        mb: 1,
                      }}
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
                  </Box>
                </CardActionArea>
                <Box
                  component="footer"
                  sx={{
                    flex: "none",
                    width: "100%",
                    boxSizing: "border-box",
                    borderTop: 1,
                    borderColor: "divider",
                    bgcolor: "background.paper",
                    px: { xs: 2, sm: 2.5 },
                    py: { xs: 2, sm: 2 },
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    flexWrap: "wrap",
                    alignItems: { xs: "stretch", sm: "center" },
                    gap: 2,
                  }}
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
                  {mcqHref && (
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
                  )}
                  {trainerHref && (
                    <Button
                      component={Link}
                      href={trainerHref}
                      variant="outlined"
                      color="inherit"
                      size="medium"
                      startIcon={<FitnessCenterRoundedIcon />}
                      sx={{ justifyContent: "center", textTransform: "none", fontWeight: 600 }}
                    >
                      Тренировка по теме
                    </Button>
                  )}
                </Box>
              </Card>
            );
          })}
        </Stack>
      </Stack>
    </QuizPageShell>
  );
}
