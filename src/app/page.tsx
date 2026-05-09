"use client";

import QuizPageShell from "@/components/QuizPageShell";
import SiteHeader from "@/components/SiteHeader";
import TopicChipFilter from "@/components/TopicChipFilter";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import CasinoRoundedIcon from "@mui/icons-material/CasinoRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LightbulbRoundedIcon from "@mui/icons-material/LightbulbRounded";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Collapse from "@mui/material/Collapse";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import QuizStatsPanel from "@/components/QuizStatsPanel";
import { quizFetch } from "@/lib/quizFetch";
import { recordTrainerSelfGradeSynced } from "@/lib/quizStats";

type Question = {
  id: number;
  topic: string;
  question: string;
  hint: string | null;
  answer: string;
};

const ALL_TOPICS_VALUE = "";

export default function Home() {
  const [message, setMessage] = useState("");
  const [messageSeverity, setMessageSeverity] = useState<"success" | "error">(
    "success",
  );
  const [current, setCurrent] = useState<Question | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [topics, setTopics] = useState<string[]>([]);
  const [topicsLoaded, setTopicsLoaded] = useState(false);
  const [topicFilter, setTopicFilter] = useState<string>(ALL_TOPICS_VALUE);
  /** Самооценка по текущей карточке после просмотра ответа */
  const [trainerGrade, setTrainerGrade] = useState<"know" | "miss" | null>(null);
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [questionLoading, setQuestionLoading] = useState(false);
  const questionLoadAbortRef = useRef<AbortController | null>(null);
  const [topicProgressMap, setTopicProgressMap] = useState<
    Record<string, { ok: number; bad: number }>
  >({});
  const [trainerByQuestionId, setTrainerByQuestionId] = useState<
    Record<number, "ok" | "bad">
  >({});

  const refreshTrainerProgress = useCallback(async () => {
    const res = await quizFetch("/api/questions/progress");
    if (!res.ok) return;
    const data = (await res.json()) as {
      byTopic?: Record<string, { ok: number; bad: number }>;
      byQuestionId?: Record<string, "ok" | "bad">;
    };
    setTopicProgressMap(data.byTopic ?? {});
    const next: Record<number, "ok" | "bad"> = {};
    for (const [k, v] of Object.entries(data.byQuestionId ?? {})) {
      const id = Number(k);
      if (Number.isFinite(id) && (v === "ok" || v === "bad")) next[id] = v;
    }
    setTrainerByQuestionId(next);
  }, []);

  useEffect(() => {
    void refreshTrainerProgress();
  }, [refreshTrainerProgress]);

  const aggregateTrainerMarks = useMemo(() => {
    let ok = 0;
    let bad = 0;
    for (const t of topics) {
      ok += topicProgressMap[t]?.ok ?? 0;
      bad += topicProgressMap[t]?.bad ?? 0;
    }
    return { ok, bad };
  }, [topics, topicProgressMap]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/questions/topics");
        const data = (await res.json()) as { topics?: string[]; error?: string };
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

  useEffect(() => {
    const id = current?.id;
    if (id === undefined) return;
    const p = trainerByQuestionId[id];
    if (p === "ok") setTrainerGrade("know");
    else if (p === "bad") setTrainerGrade("miss");
    else setTrainerGrade(null);
  }, [current?.id, trainerByQuestionId]);

  const applyTopic = useCallback((t: string) => {
    questionLoadAbortRef.current?.abort();
    questionLoadAbortRef.current = null;
    setTopicFilter(t);
    setQuestionModalOpen(false);
    setQuestionLoading(false);
    setCurrent(null);
    setShowHint(false);
    setShowAnswer(false);
    setTrainerGrade(null);
    setMessage("");
  }, []);

  const appliedTopicFromUrlRef = useRef(false);

  useEffect(() => {
    if (!topicsLoaded || appliedTopicFromUrlRef.current) return;
    const params = new URLSearchParams(window.location.search);
    const t = params.get("topic");
    if (t && topics.includes(t)) {
      appliedTopicFromUrlRef.current = true;
      applyTopic(t);
    }
  }, [topicsLoaded, topics, applyTopic]);

  const closeQuestionModal = useCallback(() => {
    questionLoadAbortRef.current?.abort();
    questionLoadAbortRef.current = null;
    setQuestionModalOpen(false);
    setQuestionLoading(false);
    setCurrent(null);
    setShowHint(false);
    setShowAnswer(false);
    setTrainerGrade(null);
  }, []);

  const getRandomQuestion = useCallback(async () => {
    questionLoadAbortRef.current?.abort();
    const ac = new AbortController();
    questionLoadAbortRef.current = ac;
    setQuestionModalOpen(true);
    setQuestionLoading(true);
    setShowHint(false);
    setShowAnswer(false);
    setCurrent(null);
    const qs =
      topicFilter === ALL_TOPICS_VALUE
        ? ""
        : `?topic=${encodeURIComponent(topicFilter)}`;
    let response: Response;
    try {
      response = await quizFetch(`/api/questions/random${qs}`, { signal: ac.signal });
    } catch {
      if (ac.signal.aborted) return;
      setQuestionLoading(false);
      setQuestionModalOpen(false);
      setCurrent(null);
      setMessageSeverity("error");
      setMessage("Не удалось загрузить вопрос.");
      return;
    }
    const data = (await response.json()) as Question & { error?: string };

    if (ac.signal.aborted) return;

    if (!response.ok) {
      setQuestionLoading(false);
      setQuestionModalOpen(false);
      setCurrent(null);
      setMessageSeverity("error");
      setMessage(data.error ?? "Ошибка при получении вопроса.");
      return;
    }

    setMessage("");
    setCurrent(data);
    setQuestionLoading(false);
  }, [topicFilter]);

  const trainerQuestionModal = (
    <Dialog
      fullScreen
      open={questionModalOpen}
      onClose={closeQuestionModal}
      aria-labelledby="trainer-dialog-title"
      slotProps={{
        paper: {
          sx: {
            bgcolor: "background.default",
            display: "flex",
            flexDirection: "column",
          },
        },
      }}
    >
      <Box
        component="header"
        sx={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 1,
          py: 1,
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          onClick={closeQuestionModal}
          aria-label="Закрыть"
        >
          <CloseRoundedIcon />
        </IconButton>
        <Typography id="trainer-dialog-title" variant="subtitle1" sx={{ flex: 1 }}>
          Вопрос
        </Typography>
      </Box>

      <DialogContent
        sx={{
          flex: 1,
          overflow: "auto",
          py: { xs: 2, sm: 3 },
          px: { xs: 2, sm: 3 },
          pb: `max(24px, env(safe-area-inset-bottom, 0px))`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {questionLoading || !current ? (
          <Stack
            spacing={2}
            sx={{
              flex: 1,
              minHeight: { xs: 200, sm: 280 },
              py: 4,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress color="secondary" size={48} thickness={4} />
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center" }}>
              Загружаем вопрос…
            </Typography>
          </Stack>
        ) : (
          <Stack spacing={2.5} sx={{ maxWidth: 1000, mx: "auto", width: "100%" }}>
            <Stack
              spacing={1.5}
              sx={{
                flexDirection: "row",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                Тема:
              </Typography>
              <Chip
                label={current.topic}
                size="medium"
                color="primary"
                variant="outlined"
                sx={{ margin: "0 !important" }}
              />
              {trainerGrade === "know" ? (
                <Chip
                  size="medium"
                  color="success"
                  variant="filled"
                  icon={<CheckCircleRoundedIcon />}
                  label="Отмечено: знал ответ"
                />
              ) : trainerGrade === "miss" ? (
                <Chip
                  size="medium"
                  color="warning"
                  variant="filled"
                  icon={<CancelRoundedIcon />}
                  label="Отмечено: не знал"
                />
              ) : trainerByQuestionId[current.id] === "ok" ? (
                <Chip
                  size="medium"
                  color="success"
                  variant="outlined"
                  icon={<CheckCircleRoundedIcon />}
                  label="Ранее в базе: знал"
                />
              ) : trainerByQuestionId[current.id] === "bad" ? (
                <Chip
                  size="medium"
                  color="error"
                  variant="outlined"
                  icon={<CancelRoundedIcon />}
                  label="Ранее в базе: не знал"
                />
              ) : null}
            </Stack>

            <Divider />

            <Typography
              component="p"
              sx={{
                fontSize: { xs: "1.25rem", sm: "1.3125rem" },
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
                gridTemplateColumns: current.hint ? { xs: "1fr", sm: "1fr 1fr" } : "1fr",
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
              <Stack spacing={2}>
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
                {trainerGrade === null ? (
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.25, fontWeight: 600 }}>
                      Оцените себя (учитывается в баллах и статистике):
                    </Typography>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={async () => {
                          if (!current) return;
                          const res = await quizFetch("/api/questions/grade", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              questionId: current.id,
                              knew: true,
                            }),
                          });
                          if (!res.ok) {
                            setMessageSeverity("error");
                            setMessage(
                              (await res.json().catch(() => ({})))?.error ??
                                "Не удалось сохранить самооценку.",
                            );
                            return;
                          }
                          setMessage("");
                          recordTrainerSelfGradeSynced();
                          setTrainerGrade("know");
                          void refreshTrainerProgress();
                        }}
                      >
                        Знал ответ (+1 балл)
                      </Button>
                      <Button
                        variant="outlined"
                        color="inherit"
                        fullWidth
                        onClick={async () => {
                          if (!current) return;
                          const res = await quizFetch("/api/questions/grade", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              questionId: current.id,
                              knew: false,
                            }),
                          });
                          if (!res.ok) {
                            setMessageSeverity("error");
                            setMessage(
                              (await res.json().catch(() => ({})))?.error ??
                                "Не удалось сохранить самооценку.",
                            );
                            return;
                          }
                          setMessage("");
                          recordTrainerSelfGradeSynced();
                          setTrainerGrade("miss");
                          void refreshTrainerProgress();
                        }}
                      >
                        Не знал
                      </Button>
                    </Stack>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    {trainerGrade === "know"
                      ? "Записано: верный самоотчёт (+1 балл)."
                      : "Записано: неверный самоотчёт."}
                  </Typography>
                )}
              </Stack>
            </Collapse>
          </Stack>
        )}
      </DialogContent>

      <Box
        sx={{
          flexShrink: 0,
          p: 2,
          pt: 1.5,
          borderTop: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
          pb: `max(16px, env(safe-area-inset-bottom, 0px))`,
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{ maxWidth: 1000, mx: "auto", width: "100%" }}
        >
          <Button
            fullWidth
            variant="outlined"
            color="inherit"
            size="large"
            onClick={closeQuestionModal}
          >
            Закрыть
          </Button>
          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            size="large"
            disabled={questionLoading || !current}
            startIcon={<NavigateNextRoundedIcon />}
            onClick={() => getRandomQuestion()}
          >
            Следующий вопрос
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );

  return (
    <QuizPageShell>
      <Stack spacing={3}>
        <SiteHeader
          title="Тренажёр вопросов"
          subtitle="Тема — кнопками или списком; можно тренироваться по всей базе. Новые карточки — на странице «Новая карточка»."
        />

        {message ? (
          <Alert severity={messageSeverity} variant="filled" sx={{ borderRadius: 2 }}>
            {message}
          </Alert>
        ) : null}

        <QuizStatsPanel />

        <Card elevation={0}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Случайный вопрос
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Получите карточку из базы и проверьте себя.
            </Typography>

            <Stack spacing={2} sx={{ mb: 2 }}>
              <TopicChipFilter
                topics={topics}
                loaded={topicsLoaded}
                value={topicFilter}
                onTopicChange={applyTopic}
                aggregateProgress={aggregateTrainerMarks}
                topicProgress={topicProgressMap}
              />
              <FormControl fullWidth disabled={!topicsLoaded}>
                <InputLabel id="trainer-topic-label">Тема</InputLabel>
                <Select
                  labelId="trainer-topic-label"
                  id="trainer-topic"
                  value={topicFilter}
                  label="Тема"
                  onChange={(e) => {
                    applyTopic(e.target.value);
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
            </Stack>

            <Button
              fullWidth
              variant="contained"
              color="secondary"
              size="large"
              startIcon={<CasinoRoundedIcon />}
              onClick={getRandomQuestion}
            >
              Вопрос
            </Button>

            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              Нажмите «Вопрос», чтобы открыть карточку на весь экран.
            </Typography>
          </CardContent>
        </Card>
      </Stack>
      {trainerQuestionModal}
    </QuizPageShell>
  );
}
