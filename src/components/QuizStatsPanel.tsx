"use client";

import {
  emptyStats,
  loadStats,
  totalFail,
  totalScore,
  totalSuccess,
  type QuizStats,
} from "@/lib/quizStats";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import { useCallback, useEffect, useState } from "react";

export default function QuizStatsPanel() {
  /** Начало с нулей: SSR и первый клиентский проход совпадают; localStorage только в useEffect — без hydration mismatch. */
  const [stats, setStats] = useState<QuizStats>(emptyStats);

  const sync = useCallback(() => {
    setStats(loadStats());
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener("quiz-stats-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("quiz-stats-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, [sync]);

  const score = totalScore(stats);
  const ok = totalSuccess(stats);
  const bad = totalFail(stats);

  return (
    <Paper
      elevation={0}
      sx={{
        px: { xs: 2, sm: 2.5 },
        py: 1.75,
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
        bgcolor: (t) => alpha(t.palette.secondary.main, 0.08),
        backgroundImage: (t) =>
          `linear-gradient(135deg, ${alpha(t.palette.secondary.dark, 0.35)} 0%, ${alpha(t.palette.background.paper, 0.5)} 100%)`,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          gap: { xs: 1.5, sm: 3 },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1.25 }}>
          <EmojiEventsRoundedIcon color="secondary" sx={{ fontSize: 28 }} />
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Баллы
            </Typography>
            <Typography
              variant="h5"
              component="p"
              sx={{ fontWeight: 800, lineHeight: 1.2, color: "secondary.light" }}
            >
              {score}
              <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 0.75, fontWeight: 500 }}>
                ({ok} успешных × 1)
              </Typography>
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 2.5,
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 0.75 }}>
            <ThumbUpAltOutlinedIcon sx={{ fontSize: 20, color: "primary.light", marginTop: "30px" }} />
            <Box>
              <Typography variant="caption" color="text.secondary">
                Верно
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2, textAlign: "center" }}>
                {ok}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 0.75 }}>
            <ThumbDownAltOutlinedIcon sx={{ fontSize: 20, color: "error.light", marginTop: "30px" }} />
            <Box>
              <Typography variant="caption" color="text.secondary">
                Неверно
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2, textAlign: "center" }}>
                {bad}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1.25, opacity: 0.9 }}>
        Тест с вариантами и самооценка на карточках (после открытия ответа). Данные в браузере.
      </Typography>
    </Paper>
  );
}
