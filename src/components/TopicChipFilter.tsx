"use client";

import {
  ALL_TOPICS_BUTTON_COPY,
  topicButtonCopy,
  type TopicVisualIcon,
} from "@/content/topicDisplay";
import AppsRoundedIcon from "@mui/icons-material/AppsRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import HubRoundedIcon from "@mui/icons-material/HubRounded";
import LabelImportantRoundedIcon from "@mui/icons-material/LabelImportantRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import OpenInBrowserRoundedIcon from "@mui/icons-material/OpenInBrowserRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import type { Theme } from "@mui/material/styles";
import { alpha, keyframes } from "@mui/material/styles";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";
import type { ComponentType } from "react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

/** Плавное «дыхание» свечения у выбранной карточки */
const selectedGlowPulse = keyframes`
  0%, 100% {
    box-shadow:
      0 10px 36px rgba(61, 149, 245, 0.42),
      0 0 0 1px rgba(255, 255, 255, 0.14),
      inset 0 1px 0 rgba(255, 255, 255, 0.12);
  }
  50% {
    box-shadow:
      0 14px 44px rgba(61, 149, 245, 0.62),
      0 0 32px rgba(7, 105, 203, 0.45),
      0 0 0 1px rgba(255, 255, 255, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.18);
  }
`;

const SLIDE_WIDTH = { xs: "min(90vw, 100%)", sm: 320 } as const;

const TOPIC_ICONS: Record<TopicVisualIcon, ComponentType<SvgIconProps>> = {
  all: AppsRoundedIcon,
  https: LockRoundedIcon,
  cors: HubRoundedIcon,
  browser: OpenInBrowserRoundedIcon,
  default: LabelImportantRoundedIcon,
};

const ICON_BOX = 56;

/** Плейсхолдер под стрелку: тот же тип layout, что у IconButton на xs/sm, без MUI Button — стабильная гидратация. */
function ScrollArrowPlaceholder({ side }: { side: "left" | "right" }) {
  return (
    <Box
      aria-hidden
      sx={{
        flexShrink: 0,
        alignSelf: "center",
        width: 48,
        height: 48,
        boxSizing: "border-box",
        border: "2px solid transparent",
        visibility: "hidden",
        pointerEvents: "none",
        position: { xs: "absolute", sm: "relative" },
        ...(side === "left"
          ? { left: { xs: "5px", sm: "auto" } }
          : { right: { xs: "5px", sm: "auto" } }),
      }}
    />
  );
}

function TopicSlideIcon({
  id,
  selected,
}: {
  id: TopicVisualIcon;
  selected: boolean;
}) {
  const Icon = TOPIC_ICONS[id];
  return (
    <Box
      className="topic-slide-icon"
      sx={{
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: { xs: "40px", sm: ICON_BOX },
        height: { xs: "40px", sm: ICON_BOX },
        borderRadius: 2,
        transition:
          "transform 0.32s cubic-bezier(0.34, 1.3, 0.64, 1), background-color 0.28s ease, box-shadow 0.28s ease",
        bgcolor: selected
          ? alpha("#ffffff", 0.22)
          : (t) => alpha(t.palette.secondary.main, 1),
        color: selected ? "common.white" : "secondary.light",
        boxShadow: selected
          ? `inset 0 0 0 1px ${alpha("#fff", 0.2)}`
          : (t) => `0 0 20px ${alpha(t.palette.secondary.main, 0.25)}`,
      }}
    >
      <Icon sx={{ fontSize: 30 }} />
    </Box>
  );
}

export type TopicChipFilterProps = {
  topics: string[];
  loaded: boolean;
  value: string;
  onTopicChange: (topic: string) => void;
  allValue?: string;
  /** Суммы «успешно / неуспешно» по каждой теме (локальный прогресс). */
  topicProgress?: Record<string, { ok: number; bad: number }>;
  /** Те же суммы для кнопки «Все темы». */
  aggregateProgress?: { ok: number; bad: number };
};

function ProgressMarks({
  ok,
  bad,
  selected,
}: {
  ok: number;
  bad: number;
  selected: boolean;
}) {
  if (ok === 0 && bad === 0) return null;
  const sub = selected ? "rgba(255,255,255,0.88)" : "text.secondary";
  return (
    <Box sx={{ mt: 0.75, display: "flex", alignItems: "center", gap: 1.25, flexWrap: "wrap" }}>
      {ok > 0 ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.35 }}>
          <CheckCircleRoundedIcon sx={{ fontSize: 18, color: "success.light" }} />
          <Typography component="span" variant="caption" sx={{ fontWeight: 600, color: sub }}>
            {ok}
          </Typography>
        </Box>
      ) : null}
      {bad > 0 ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.35 }}>
          <HighlightOffRoundedIcon sx={{ fontSize: 18, color: "error.light" }} />
          <Typography component="span" variant="caption" sx={{ fontWeight: 600, color: sub }}>
            {bad}
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
}

export default function TopicChipFilter({
  topics,
  loaded,
  value,
  onTopicChange,
  allValue = "",
  topicProgress = {},
  aggregateProgress,
}: TopicChipFilterProps) {
  const isAll = value === allValue;
  const scrollRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const initialScrollDoneRef = useRef(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  /** Стрелки с IconButton только на клиенте после гидратации — иначе Emotion даёт разный className SSR/CSR */
  const [clientArrowsMounted, setClientArrowsMounted] = useState(false);

  const setSlideRef = useCallback((key: string) => {
    return (el: HTMLButtonElement | null) => {
      if (el) slideRefs.current.set(key, el);
      else slideRefs.current.delete(key);
    };
  }, []);

  const scrollSelectedIntoView = useCallback(
    (behavior: ScrollBehavior = "smooth") => {
      const container = scrollRef.current;
      if (!container || !loaded) return;

      const targetKey = isAll ? allValue : value;
      const slide = slideRefs.current.get(targetKey);
      if (!slide) return;

      const idealLeft =
        slide.offsetLeft - (container.clientWidth - slide.offsetWidth) / 2;
      const maxLeft = container.scrollWidth - container.clientWidth;
      container.scrollTo({
        left: Math.max(0, Math.min(idealLeft, maxLeft)),
        behavior,
      });
    },
    [allValue, isAll, loaded, value],
  );

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const max = scrollWidth - clientWidth;
    setCanScrollLeft(scrollLeft > 2);
    setCanScrollRight(scrollLeft < max - 2);
  }, []);

  useLayoutEffect(() => {
    setClientArrowsMounted(true);
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [topics, loaded, updateScrollState]);

  useLayoutEffect(() => {
    if (!loaded) return;
    const behavior: ScrollBehavior = initialScrollDoneRef.current ? "smooth" : "auto";
    const id = requestAnimationFrame(() => {
      scrollSelectedIntoView(behavior);
      updateScrollState();
      initialScrollDoneRef.current = true;
    });
    return () => cancelAnimationFrame(id);
  }, [loaded, value, topics, scrollSelectedIntoView, updateScrollState]);

  const scrollByDir = (dir: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    const step = Math.max(260, el.clientWidth * 0.72);
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const slideButtonSx = (selected: boolean) => ({
    flex: "0 0 auto",
    width: SLIDE_WIDTH,
    minWidth: 272,
    justifyContent: "flex-start",
    alignItems: "stretch",
    flexDirection: "column",
    textAlign: "left",
    textTransform: "none",
    minHeight: 148,
    py: 2.5,
    px: 2.25,
    borderRadius: 2.5,
    borderWidth: 2,
    scrollSnapAlign: "start",
    scrollSnapStop: "always",
    transition:
      "transform 0.35s cubic-bezier(0.34, 1.35, 0.64, 1), box-shadow 0.35s ease, border-color 0.28s ease, background 0.35s ease, filter 0.28s ease",
    willChange: "transform",
    paddingBottom: "30px",
    paddingTop: "30px",
    ...(selected
      ? {
        background: (t: Theme) =>
          `linear-gradient(155deg, ${t.palette.secondary.dark} 0%, black 48%, ${alpha(t.palette.secondary.light, 0.92)} 110%)`,
        borderColor: alpha("#3d95f5", 0.85),
        color: "common.white",
        filter: "saturate(1.08)",
        animation: `${selectedGlowPulse} 2.8s ease-in-out infinite`,
      }
      : {
        bgcolor: (t: Theme) =>
          `linear-gradient(165deg, ${alpha(t.palette.secondary.main, 0.14)} 0%, ${alpha(t.palette.background.paper, 0.92)} 55%, ${alpha(t.palette.secondary.dark, 0.12)} 100%)`,
        borderColor: (t: Theme) => alpha(t.palette.secondary.light, 0.55),
      }),
    "&:hover:not(:disabled)": {
      "& .topic-slide-icon": {
        transform: "scale(1.08) rotate(-2deg)",
      },
      ...(selected
        ? {
          transform: "translateY(-4px) scale(1.025)",
          filter: "saturate(1.12) brightness(1.03)",
        }
        : {
          transform: "translateY(-5px) scale(1.03)",
          bgcolor: (t: Theme) =>
            `linear-gradient(165deg, ${alpha(t.palette.secondary.main, 0.28)} 0%, ${alpha(t.palette.background.paper, 0.97)} 50%, ${alpha(t.palette.secondary.main, 0.18)} 100%)`,
          borderColor: "secondary.light",
          boxShadow: (t: Theme) =>
            `0 14px 36px ${alpha(t.palette.common.black, 0.42)}, 0 0 28px ${alpha(t.palette.secondary.main, 0.22)}`,
        }),
    },
    "&:active:not(:disabled)": {
      transform: "translateY(-2px) scale(1.02)",
      transitionDuration: "0.12s",
    },
  });

  const topicSlide = (t: string) => {
    const selected = value === t;
    const { title, description, icon } = topicButtonCopy(t);
    const marks = topicProgress[t];
    const ok = marks?.ok ?? 0;
    const bad = marks?.bad ?? 0;
    return (
      <Button
        key={t}
        ref={setSlideRef(t)}
        disabled={!loaded}
        onClick={() => onTopicChange(t)}
        variant={selected ? "contained" : "outlined"}
        color={selected ? "secondary" : "inherit"}
        sx={slideButtonSx(selected)}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            gap: 2,
            width: "100%",
          }}
        >
          <TopicSlideIcon id={icon} selected={selected} />
          <Box sx={{ minWidth: 0, flex: 1, pt: 0.25 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 800,
                letterSpacing: "-0.02em",
                lineHeight: 1.28,
                fontSize: "1.125rem",
                color: selected ? "common.white" : "text.primary",
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mt: 0.75,
                lineHeight: 1.5,
                fontSize: "1.0625rem",
                fontWeight: 450,
                color: selected ? "rgba(255,255,255,0.92)" : "text.secondary",
              }}
            >
              {description}
            </Typography>
            <ProgressMarks ok={ok} bad={bad} selected={selected} />
          </Box>
        </Box>
      </Button>
    );
  };

  return (
    <Box>
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: { xs: 0.5, sm: 1 },
        }}
      >
        {clientArrowsMounted ? (
          <IconButton
            aria-label="Прокрутить темы назад"
            onClick={() => scrollByDir(-1)}
            disableRipple
            disabled={!loaded || !canScrollLeft}
            sx={{
              alignSelf: "center",
              flexShrink: 0,
              color: "secondary.light",
              bgcolor: { xs: "transparent", sm: (t) => alpha(t.palette.background.paper, 0.85) },
              border: 2,
              borderColor: { xs: "transparent", sm: (t) => alpha(t.palette.secondary.main, 0.35) },
              transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
              "&:hover:not(:disabled)": {
                bgcolor: { xs: "transparent", sm: "action.hover" },
                borderColor: { xs: "transparent", sm: "secondary.light" },
                transform: "scale(1.06)",
                boxShadow: { xs: "none", sm: (t) => `0 4px 18px ${alpha(t.palette.secondary.main, 0.28)}` },
              },
              position: { xs: "absolute", sm: "relative" },
              left: { xs: "5px", sm: "auto" },
              "&.Mui-disabled": { opacity: 0.35 },
            }}
          >
            <ChevronLeftRoundedIcon />
          </IconButton>
        ) : (
          <ScrollArrowPlaceholder side="left" />
        )}

        <Box
          ref={scrollRef}
          sx={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            alignItems: "center",
            gap: 2,
            overflowX: "auto",
            overflowY: "hidden",
            /** Запас под размытие box-shadow и свечение — иначе режется overflow */
            minHeight: { xs: 236, sm: 244 },
            py: { xs: 0, sm: 3.5 },
            px: { xs: 3, sm: 3.5 },
            scrollSnapType: "x mandatory",
            scrollPaddingLeft: 12,
            scrollPaddingRight: 12,
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            "&::-webkit-scrollbar": {
              display: "none",
              height: 0,
              width: 0,
            },
          }}
        >
          <Button
            ref={setSlideRef(allValue)}
            disabled={!loaded}
            onClick={() => onTopicChange(allValue)}
            variant={isAll ? "contained" : "outlined"}
            color={isAll ? "secondary" : "inherit"}
            sx={slideButtonSx(isAll)}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                gap: 2,
                width: "100%",
              }}
            >
              <TopicSlideIcon id={ALL_TOPICS_BUTTON_COPY.icon} selected={isAll} />
              <Box sx={{ minWidth: 0, flex: 1, pt: 0.25 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.28,
                    fontSize: "1.0625rem",
                    color: isAll ? "common.white" : "text.primary",
                  }}
                >
                  {ALL_TOPICS_BUTTON_COPY.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    mt: 0.75,
                    lineHeight: 1.5,
                    fontSize: "1.0625rem",
                    fontWeight: 450,
                    color: isAll ? "rgba(255,255,255,0.92)" : "text.secondary",
                  }}
                >
                  {ALL_TOPICS_BUTTON_COPY.description}
                </Typography>
                {aggregateProgress && (
                  <ProgressMarks
                    ok={aggregateProgress.ok}
                    bad={aggregateProgress.bad}
                    selected={isAll}
                  />
                )}
              </Box>
            </Box>
          </Button>

          {topics.map((t) => topicSlide(t))}
        </Box>

        {clientArrowsMounted ? (
          <IconButton
            aria-label="Прокрутить темы вперёд"
            onClick={() => scrollByDir(1)}
            disableRipple
            disabled={!loaded || !canScrollRight}
            sx={{
              alignSelf: "center",
              flexShrink: 0,
              color: "secondary.light",
              bgcolor: { xs: "transparent", sm: (t) => alpha(t.palette.background.paper, 0.85) },
              border: 2,
              borderColor: { xs: "transparent", sm: (t) => alpha(t.palette.secondary.main, 0.35) },
              transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
              "&:hover:not(:disabled)": {
                bgcolor: { xs: "transparent", sm: "action.hover" },
                borderColor: { xs: "transparent", sm: "secondary.light" },
                transform: "scale(1.06)",
                boxShadow: { xs: "none", sm: (t) => `0 4px 18px ${alpha(t.palette.secondary.main, 0.28)}` },
              },
              position: { xs: "absolute", sm: "relative" },
              right: { xs: "5px", sm: "auto" },
              "&.Mui-disabled": { opacity: 0.35 },
            }}
          >
            <ChevronRightRoundedIcon />
          </IconButton>
        ) : (
          <ScrollArrowPlaceholder side="right" />
        )}
      </Box>
    </Box>
  );
}
