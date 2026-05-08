"use client";

import QuizPageShell from "@/components/QuizPageShell";
import SiteHeader from "@/components/SiteHeader";
import CasinoRoundedIcon from "@mui/icons-material/CasinoRounded";
import FactCheckRoundedIcon from "@mui/icons-material/FactCheckRounded";
import LightbulbRoundedIcon from "@mui/icons-material/LightbulbRounded";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";
import { useCallback, useEffect, useState } from "react";

type McqOption = { id: number; text: string };

type McqPayload = {
  id: number;
  topic: string;
  question: string;
  hint: string | null;
  options: McqOption[];
};

const ALL_TOPICS_VALUE = "";

export default function McqPage() {
  const theme = useTheme();
  const [message, setMessage] = useState("");
  const [messageSeverity, setMessageSeverity] = useState<"success" | "error">(
    "success",
  );
  const [current, setCurrent] = useState<McqPayload | null>(null);
  const [selectedId, setSelectedId] = useState<string>("");
  const [showHint, setShowHint] = useState(false);
  const [verified, setVerified] = useState<{
    correct: boolean;
    correctOptionId: number | null;
  } | null>(null);

  const [topics, setTopics] = useState<string[]>([]);
  const [topicsLoaded, setTopicsLoaded] = useState(false);
  const [topicFilter, setTopicFilter] = useState<string>(ALL_TOPICS_VALUE);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/mcq/topics");
        const data = (await res.json()) as { topics?: string[] };
        if (!res.ok || !data.topics) {
          if (!cancelled) setTopics([]);
          return;
        }
        if (!cancelled) setTopics(data.topics);
      } catch {
        if (!cancelled) setTopics([]);
      } finally {
        if (!cancelled) setTopicsLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const loadQuestion = useCallback(async () => {
    setShowHint(false);
    setVerified(null);
    setSelectedId("");
    const qs =
      topicFilter === ALL_TOPICS_VALUE
        ? ""
        : `?topic=${encodeURIComponent(topicFilter)}`;
    const response = await fetch(`/api/mcq/random${qs}`);
    const data = (await response.json()) as McqPayload & { error?: string };

    if (!response.ok) {
      setCurrent(null);
      setMessageSeverity("error");
      setMessage(data.error ?? "Ошибка при загрузке вопроса.");
      return;
    }

    setMessage("");
    setCurrent(data);
  }, [topicFilter]);

  const handleVerify = useCallback(async () => {
    if (!current || !selectedId) return;
    const optionId = Number(selectedId);
    const response = await fetch("/api/mcq/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionId: current.id,
        optionId,
      }),
    });
    const data = (await response.json()) as {
      correct?: boolean;
      correctOptionId?: number | null;
      error?: string;
    };

    if (!response.ok) {
      setMessageSeverity("error");
      setMessage(data.error ?? "Не удалось проверить ответ.");
      return;
    }

    setMessage("");
    setVerified({
      correct: Boolean(data.correct),
      correctOptionId:
        typeof data.correctOptionId === "number" ? data.correctOptionId : null,
    });
  }, [current, selectedId]);

  const optionStyle = (optionId: number) => {
    if (!verified || verified.correctOptionId === null) return {};
    const isCorrect = optionId === verified.correctOptionId;
    const isChosen = optionId === Number(selectedId);
    if (isCorrect) {
      return {
        borderColor: "primary.main",
        bgcolor: alpha(theme.palette.primary.main, 0.18),
      };
    }
    if (isChosen && !verified.correct) {
      return {
        borderColor: "error.main",
        bgcolor: alpha(theme.palette.error.main, 0.14),
      };
    }
    return {};
  };

  return (
    <QuizPageShell>
      <Stack spacing={3}>
        <SiteHeader
          title="Тест: варианты ответов"
          subtitle="Выберите один вариант и проверьте себя. Ответ хранится на сервере — подсказки ключа нет."
        />

        {message ? (
          <Alert severity={messageSeverity} variant="filled" sx={{ borderRadius: 2 }}>
            {message}
          </Alert>
        ) : null}

        <Card elevation={0}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Вопрос с вариантами
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Случайный вопрос из базы тестов. Тему можно сузить ниже.
            </Typography>

            <FormControl fullWidth sx={{ mb: 2 }} disabled={!topicsLoaded}>
              <InputLabel id="mcq-topic-label">Тема</InputLabel>
              <Select
                labelId="mcq-topic-label"
                id="mcq-topic"
                value={topicFilter}
                label="Тема"
                onChange={(e) => {
                  setTopicFilter(e.target.value);
                  setCurrent(null);
                  setSelectedId("");
                  setShowHint(false);
                  setVerified(null);
                  setMessage("");
                }}
              >
                <MenuItem value={ALL_TOPICS_VALUE}>Все темы</MenuItem>
                {topics.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Stack spacing={1.5} sx={{ mb: 2 }}>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                size="large"
                startIcon={<CasinoRoundedIcon />}
                onClick={loadQuestion}
              >
                Другой вопрос
              </Button>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                disabled={!current || !selectedId || verified !== null}
                startIcon={<FactCheckRoundedIcon />}
                onClick={handleVerify}
              >
                Проверить ответ
              </Button>
            </Stack>

            {current ? (
              <Stack spacing={2.5}>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    Тема:
                  </Typography>
                  <Chip
                    label={current.topic}
                    size="medium"
                    color="primary"
                    variant="outlined"
                    sx={{ margin: "0 !important" }}
                  />
                </Box>

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

                {current.hint ? (
                  <>
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
                  </>
                ) : null}

                <FormControl component="fieldset" sx={{ width: "100%" }}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Варианты ответа
                  </Typography>
                  <RadioGroup
                    name={`mcq-${current.id}`}
                    value={selectedId}
                    onChange={(e) => {
                      setSelectedId(e.target.value);
                      setVerified(null);
                    }}
                  >
                    <Stack spacing={1.25}>
                      {current.options.map((opt) => (
                        <Box
                          key={opt.id}
                          sx={{
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 1,
                            px: 1.5,
                            py: 0.5,
                            transition: (t) =>
                              t.transitions.create(["border-color", "background-color"], {
                                duration: t.transitions.duration.short,
                              }),
                            ...optionStyle(opt.id),
                          }}
                        >
                          <FormControlLabel
                            value={String(opt.id)}
                            control={<Radio />}
                            label={opt.text}
                            disabled={verified !== null}
                            sx={{
                              alignItems: "flex-start",
                              m: 0,
                              "& .MuiFormControlLabel-label": {
                                pt: 0.85,
                                fontSize: "1.0625rem",
                                lineHeight: 1.55,
                              },
                            }}
                          />
                        </Box>
                      ))}
                    </Stack>
                  </RadioGroup>
                </FormControl>

                {verified ? (
                  <Alert
                    severity={verified.correct ? "success" : "warning"}
                    variant="outlined"
                    sx={{ borderRadius: 2 }}
                  >
                    {verified.correct
                      ? "Верно."
                      : "Неверно — верный вариант подсвечен зелёным."}
                  </Alert>
                ) : null}
              </Stack>
            ) : (
              <Typography variant="body1" color="text.secondary">
                Нажмите «Другой вопрос», чтобы загрузить тест.
              </Typography>
            )}
          </CardContent>
        </Card>
      </Stack>
    </QuizPageShell>
  );
}
