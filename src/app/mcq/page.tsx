"use client";

import QuizPageShell from "@/components/QuizPageShell";
import SiteHeader from "@/components/SiteHeader";
import TopicChipFilter from "@/components/TopicChipFilter";
import CasinoRoundedIcon from "@mui/icons-material/CasinoRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import FactCheckRoundedIcon from "@mui/icons-material/FactCheckRounded";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import LightbulbRoundedIcon from "@mui/icons-material/LightbulbRounded";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import QuizStatsPanel from "@/components/QuizStatsPanel";
import { quizFetch } from "@/lib/quizFetch";
import { recordMcqResult } from "@/lib/quizStats";

type McqOption = { id: number; text: string };

type McqPayload = {
  id: number;
  topic: string;
  question: string;
  hint: string | null;
  options: McqOption[];
};

const ALL_TOPICS_VALUE = "";

function McqPageInner() {
  const theme = useTheme();
  const searchParams = useSearchParams();
  const topicParam = searchParams.get("topic");
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
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [questionLoading, setQuestionLoading] = useState(false);
  const questionLoadAbortRef = useRef<AbortController | null>(null);
  const [topicProgressMap, setTopicProgressMap] = useState<
    Record<string, { ok: number; bad: number }>
  >({});
  const [mcqByQuestionId, setMcqByQuestionId] = useState<
    Record<number, "ok" | "bad">
  >({});

  const refreshMcqProgress = useCallback(async () => {
    const res = await quizFetch("/api/mcq/progress");
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
    setMcqByQuestionId(next);
  }, []);

  useEffect(() => {
    void refreshMcqProgress();
  }, [refreshMcqProgress]);

  const aggregateMcqMarks = useMemo(() => {
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

  useEffect(() => {
    if (!topicsLoaded || topics.length === 0) return;
    if (!topicParam) return;
    let decoded = topicParam;
    try {
      decoded = decodeURIComponent(topicParam);
    } catch {
      return;
    }
    const trimmed = decoded.trim();
    if (!topics.includes(trimmed)) return;
    questionLoadAbortRef.current?.abort();
    questionLoadAbortRef.current = null;
    setTopicFilter(trimmed);
    setQuestionModalOpen(false);
    setQuestionLoading(false);
    setCurrent(null);
    setSelectedId("");
    setShowHint(false);
    setVerified(null);
    setMessage("");
  }, [topicsLoaded, topics, topicParam]);

  const applyTopic = useCallback((t: string) => {
    questionLoadAbortRef.current?.abort();
    questionLoadAbortRef.current = null;
    setTopicFilter(t);
    setQuestionModalOpen(false);
    setQuestionLoading(false);
    setCurrent(null);
    setSelectedId("");
    setShowHint(false);
    setVerified(null);
    setMessage("");
  }, []);

  const closeQuestionModal = useCallback(() => {
    questionLoadAbortRef.current?.abort();
    questionLoadAbortRef.current = null;
    setQuestionModalOpen(false);
    setQuestionLoading(false);
    setCurrent(null);
    setSelectedId("");
    setShowHint(false);
    setVerified(null);
  }, []);

  const loadQuestion = useCallback(async () => {
    questionLoadAbortRef.current?.abort();
    const ac = new AbortController();
    questionLoadAbortRef.current = ac;
    setQuestionModalOpen(true);
    setQuestionLoading(true);
    setShowHint(false);
    setVerified(null);
    setSelectedId("");
    setCurrent(null);
    const qs =
      topicFilter === ALL_TOPICS_VALUE
        ? ""
        : `?topic=${encodeURIComponent(topicFilter)}`;
    let response: Response;
    try {
      response = await quizFetch(`/api/mcq/random${qs}`, { signal: ac.signal });
    } catch {
      if (ac.signal.aborted) return;
      setQuestionLoading(false);
      setQuestionModalOpen(false);
      setCurrent(null);
      setMessageSeverity("error");
      setMessage("Не удалось загрузить вопрос.");
      return;
    }
    const data = (await response.json()) as McqPayload & { error?: string };

    if (ac.signal.aborted) return;

    if (!response.ok) {
      setQuestionLoading(false);
      setQuestionModalOpen(false);
      setCurrent(null);
      setMessageSeverity("error");
      setMessage(data.error ?? "Ошибка при загрузке вопроса.");
      return;
    }

    setMessage("");
    setCurrent(data);
    setQuestionLoading(false);
  }, [topicFilter]);

  const handleVerify = useCallback(async () => {
    if (!current || !selectedId) return;
    const optionId = Number(selectedId);
    const response = await quizFetch("/api/mcq/verify", {
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
    const correct = Boolean(data.correct);
    recordMcqResult();
    void refreshMcqProgress();
    setVerified({
      correct,
      correctOptionId:
        typeof data.correctOptionId === "number" ? data.correctOptionId : null,
    });
  }, [current, selectedId, refreshMcqProgress]);

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

  const questionModal = (
    <Dialog
      fullScreen
      open={questionModalOpen}
      onClose={closeQuestionModal}
      aria-labelledby="mcq-dialog-title"
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
          sx={{ marginLeft: { xs: "0px" } }}
        >
          <CloseRoundedIcon />
        </IconButton>
        <Typography id="mcq-dialog-title" variant="subtitle1" sx={{ flex: 1 }}>
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
              {verified ? (
                <Chip
                  size="medium"
                  color={verified.correct ? "success" : "warning"}
                  variant="filled"
                  icon={
                    verified.correct ? (
                      <CheckCircleRoundedIcon />
                    ) : (
                      <CancelRoundedIcon />
                    )
                  }
                  label={verified.correct ? "Сейчас: верно" : "Сейчас: неверно"}
                />
              ) : mcqByQuestionId[current.id] ? (
                <Chip
                  size="medium"
                  color={mcqByQuestionId[current.id] === "ok" ? "success" : "error"}
                  variant="outlined"
                  icon={
                    mcqByQuestionId[current.id] === "ok" ? (
                      <CheckCircleRoundedIcon />
                    ) : (
                      <CancelRoundedIcon />
                    )
                  }
                  label={
                    mcqByQuestionId[current.id] === "ok"
                      ? "В базе уже: верно"
                      : "В базе уже: неверно"
                  }
                />
              ) : null}
            </Box>

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

            {current.hint ? (
              <>
                <Button
                  fullWidth
                  size="medium"
                  variant="outlined"
                  startIcon={<LightbulbRoundedIcon />}
                  onClick={() => setShowHint((v) => !v)}
                  sx={(t) => ({
                    justifyContent: "center",
                    py: 1.25,
                    color: t.palette.common.white,
                    borderColor: alpha(t.palette.common.white, 0.75),
                    "&:hover": {
                      borderColor: t.palette.common.white,
                      bgcolor: alpha(t.palette.common.white, 0.1),
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
                      onClick={() => {
                        if (verified !== null) return;
                        setSelectedId(String(opt.id));
                        setVerified(null);
                      }}
                      sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                        px: 1.5,
                        py: 0.5,
                        cursor: verified !== null ? "default" : "pointer",
                        transition: (t) =>
                          t.transitions.create(
                            ["border-color", "background-color"],
                            { duration: t.transitions.duration.short },
                          ),
                        ...(verified === null && {
                          "&:hover": {
                            borderColor: "secondary.light",
                            bgcolor: alpha(theme.palette.secondary.main, 0.1),
                          },
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
                          width: "100%",
                          py: 0.5,
                          cursor: "inherit",
                          "& .MuiFormControlLabel-label": {
                            flex: 1,
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
          direction="row"
          spacing={1.5}
          sx={{
            maxWidth: 1000,
            mx: "auto",
            width: { xs: "max-content", sm: "100%" },
            justifyContent: { xs: "space-between", sm: "stretch" },
            alignItems: "stretch",
            flexWrap: "nowrap",
          }}
        >
          <Tooltip title="Закрыть">
            <Button
              fullWidth
              variant="outlined"
              color="inherit"
              size="large"
              aria-label="Закрыть"
              onClick={closeQuestionModal}
              startIcon={<CloseRoundedIcon />}
              sx={{
                flex: { xs: "0 1 auto", sm: 1 },
                minWidth: { xs: 48, sm: "auto" },
                maxWidth: { xs: "max-content", sm: "none" },
                px: { xs: 1.25, sm: 2 },
                justifyContent: { xs: "center", sm: "flex-start" },
                "& .MuiButton-startIcon": {
                  m: 0,
                  mr: { sm: 1 },
                },
              }}
            >
              <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                Закрыть
              </Box>
            </Button>
          </Tooltip>
          <Tooltip title="Проверить ответ">
            <Box
              component="span"
              sx={{
                flex: { xs: "0 1 auto", sm: 1 },
                display: "flex",
                minWidth: 0,
              }}
            >
              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                aria-label="Проверить ответ"
                disabled={
                  questionLoading || !current || !selectedId || verified !== null
                }
                startIcon={<FactCheckRoundedIcon />}
                onClick={handleVerify}
                sx={{
                  minWidth: { xs: 48, sm: "auto" },
                  px: { xs: 1.25, sm: 2 },
                  justifyContent: { xs: "center", sm: "flex-start" },
                  "& .MuiButton-startIcon": {
                    m: 0,
                    mr: { sm: 1 },
                  },
                }}
              >
                <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                  Проверить ответ
                </Box>
              </Button>
            </Box>
          </Tooltip>
          <Tooltip title="Следующий вопрос">
            <Box
              component="span"
              sx={{
                flex: { xs: "0 1 auto", sm: 1 },
                display: "flex",
                minWidth: 0,
              }}
            >
              <Button
                fullWidth
                variant="outlined"
                color="secondary"
                size="large"
                aria-label="Следующий вопрос"
                disabled={questionLoading || !current}
                startIcon={<NavigateNextRoundedIcon />}
                onClick={() => loadQuestion()}
                sx={{
                  minWidth: { xs: 48, sm: "auto" },
                  px: { xs: 1.25, sm: 2 },
                  justifyContent: { xs: "center", sm: "flex-start" },
                  "& .MuiButton-startIcon": {
                    m: 0,
                    mr: { sm: 1 },
                  },
                }}
              >
                <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                  Следующий вопрос
                </Box>
              </Button>
            </Box>
          </Tooltip>
        </Stack>
      </Box>
    </Dialog>
  );

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

        <QuizStatsPanel />

        <Card elevation={0}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Вопрос с вариантами
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Случайный вопрос из базы тестов. Тему можно выбрать кнопками или в списке.
            </Typography>

            <Stack spacing={2} sx={{ mb: 2 }}>
              <TopicChipFilter
                topics={topics}
                loaded={topicsLoaded}
                value={topicFilter}
                onTopicChange={applyTopic}
                aggregateProgress={aggregateMcqMarks}
                topicProgress={topicProgressMap}
              />
              <FormControl fullWidth disabled={!topicsLoaded}>
                <InputLabel id="mcq-topic-label">Тема</InputLabel>
                <Select
                  labelId="mcq-topic-label"
                  id="mcq-topic"
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
              onClick={loadQuestion}
            >
              Вопрос
            </Button>

            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              Нажмите «Вопрос», чтобы открыть тест на весь экран.
            </Typography>
          </CardContent>
        </Card>
      </Stack>
      {questionModal}
    </QuizPageShell>
  );
}

function McqPageFallback() {
  return (
    <QuizPageShell>
      <Stack spacing={3}>
        <SiteHeader
          title="Тест: варианты ответов"
          subtitle="Загрузка страницы теста…"
        />
      </Stack>
    </QuizPageShell>
  );
}

export default function McqPage() {
  return (
    <Suspense fallback={<McqPageFallback />}>
      <McqPageInner />
    </Suspense>
  );
}
