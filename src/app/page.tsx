"use client";

import QuizPageShell from "@/components/QuizPageShell";
import SiteHeader from "@/components/SiteHeader";
import CasinoRoundedIcon from "@mui/icons-material/CasinoRounded";
import LightbulbRoundedIcon from "@mui/icons-material/LightbulbRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import { useState } from "react";

type Question = {
  id: number;
  topic: string;
  question: string;
  hint: string | null;
  answer: string;
};

export default function Home() {
  const [message, setMessage] = useState("");
  const [messageSeverity, setMessageSeverity] = useState<"success" | "error">(
    "success",
  );
  const [current, setCurrent] = useState<Question | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  async function getRandomQuestion() {
    setShowHint(false);
    setShowAnswer(false);
    const response = await fetch("/api/questions/random");
    const data = (await response.json()) as Question & { error?: string };

    if (!response.ok) {
      setCurrent(null);
      setMessageSeverity("error");
      setMessage(data.error ?? "Ошибка при получении вопроса.");
      return;
    }

    setMessage("");
    setCurrent(data);
  }

  return (
    <QuizPageShell>
      <Stack spacing={3}>
        <SiteHeader
          title="Тренажёр вопросов"
          subtitle="Получайте случайные карточки из базы. Новые вопросы добавляйте на странице «Новая карточка»."
        />

        {message ? (
          <Alert severity={messageSeverity} variant="filled" sx={{ borderRadius: 2 }}>
            {message}
          </Alert>
        ) : null}

        <Card elevation={0}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Случайный вопрос
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Получите карточку из базы и проверьте себя.
            </Typography>

            <Button
              fullWidth
              variant="contained"
              color="secondary"
              size="large"
              startIcon={<CasinoRoundedIcon />}
              onClick={getRandomQuestion}
              sx={{ mb: 2 }}
            >
              Другой вопрос
            </Button>

            {current ? (
              <Stack spacing={2.5}>
                <Stack
                  spacing={1.5}
                  sx={{
                    flexDirection: "row",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2
                  }}
                >
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Тема:
                  </Typography>
                  <Chip label={current.topic} size="medium" color="primary" variant="outlined" sx={{ margin: "0 !important" }} />
                </Stack>

                <Divider />

                <Typography
                  component="p"
                  sx={{
                    fontSize: "1.3125rem",
                    fontWeight: 400,
                    lineHeight: 1.78,
                    letterSpacing: "0.015em",
                    color: "text.primary",
                  }}
                >
                  {current.question}
                </Typography>

                <Box
                  sx={{
                    display: "grid",
                    gap: 1.5,
                    gridTemplateColumns: current.hint
                      ? { xs: "1fr", sm: "1fr 1fr" }
                      : "1fr",
                  }}
                >
                  {current.hint ? (
                    <Button
                      fullWidth
                      size="medium"
                      variant="outlined"
                      startIcon={<LightbulbRoundedIcon />}
                      onClick={() => setShowHint((v) => !v)}
                      sx={(theme) => ({
                        justifyContent: "center",
                        py: 1.25,
                        color: theme.palette.common.white,
                        borderColor: alpha(theme.palette.common.white, 0.75),
                        "&:hover": {
                          borderColor: theme.palette.common.white,
                          bgcolor: alpha(theme.palette.common.white, 0.1),
                        },
                      })}
                    >
                      {showHint ? "Скрыть подсказку" : "Подсказка"}
                    </Button>
                  ) : null}
                  <Button
                    fullWidth
                    size="medium"
                    variant="contained"
                    color="primary"
                    startIcon={<VisibilityRoundedIcon />}
                    onClick={() => setShowAnswer((v) => !v)}
                    sx={{ justifyContent: "center", py: 1.25 }}
                  >
                    {showAnswer ? "Скрыть ответ" : "Показать ответ"}
                  </Button>
                </Box>

                {current.hint ? (
                  <Collapse in={showHint}>
                    <Alert
                      severity="info"
                      icon={<LightbulbRoundedIcon />}
                      sx={{
                        borderRadius: "6px",
                        borderColor: "secondary.main",
                        "& .MuiAlert-message": { width: "100%" },
                      }}
                    >
                      <Typography
                        sx={{
                          whiteSpace: "pre-wrap",
                          fontSize: "1.1875rem",
                          fontWeight: 400,
                          lineHeight: 1.72,
                        }}
                      >
                        {current.hint}
                      </Typography>
                    </Alert>
                  </Collapse>
                ) : null}

                <Collapse in={showAnswer}>
                  <Box
                    sx={{
                      p: 2.25,
                      borderRadius: "6px",
                      bgcolor: "action.hover",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Typography
                      variant="overline"
                      color="text.secondary"
                      sx={{ display: "block", mb: 1.25, letterSpacing: "0.08em", fontWeight: 600 }}
                    >
                      Ответ
                    </Typography>
                    <Typography
                      sx={{
                        whiteSpace: "pre-wrap",
                        fontSize: "1.1875rem",
                        fontWeight: 400,
                        lineHeight: 1.75,
                      }}
                    >
                      {current.answer}
                    </Typography>
                  </Box>
                </Collapse>
              </Stack>
            ) : (
              <Typography variant="body1" color="text.secondary">
                Нажмите «Другой вопрос», чтобы начать.
              </Typography>
            )}
          </CardContent>
        </Card>
      </Stack>
    </QuizPageShell>
  );
}
