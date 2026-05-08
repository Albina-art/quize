"use client";

import {
  ALL_TOPICS_BUTTON_COPY,
  topicButtonCopy,
  type TopicVisualIcon,
} from "@/content/topicDisplay";
import AppsRoundedIcon from "@mui/icons-material/AppsRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
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
import { useCallback, useEffect, useRef, useState } from "react";

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

const SLIDE_WIDTH = { xs: "min(90vw, 320px)", sm: 320 } as const;

const TOPIC_ICONS: Record<TopicVisualIcon, ComponentType<SvgIconProps>> = {
  all: AppsRoundedIcon,
  https: LockRoundedIcon,
  cors: HubRoundedIcon,
  browser: OpenInBrowserRoundedIcon,
  default: LabelImportantRoundedIcon,
};

const ICON_BOX = 56;

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
        width: ICON_BOX,
        height: ICON_BOX,
        borderRadius: 2,
        transition:
          "transform 0.32s cubic-bezier(0.34, 1.3, 0.64, 1), background-color 0.28s ease, box-shadow 0.28s ease",
        bgcolor: selected
          ? alpha("#ffffff", 0.22)
          : (t) => alpha(t.palette.secondary.main, 0.22),
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
};

export default function TopicChipFilter({
  topics,
  loaded,
  value,
  onTopicChange,
  allValue = "",
}: TopicChipFilterProps) {
  const isAll = value === allValue;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const max = scrollWidth - clientWidth;
    setCanScrollLeft(scrollLeft > 2);
    setCanScrollRight(scrollLeft < max - 2);
  }, []);

  useEffect(() => {
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
          `linear-gradient(155deg, ${t.palette.secondary.dark} 0%, ${t.palette.secondary.main} 48%, ${alpha(t.palette.secondary.light, 0.92)} 110%)`,
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
    return (
      <Button
        key={t}
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
                fontSize: "1.0625rem",
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
                fontSize: "0.96875rem",
                fontWeight: 450,
                color: selected ? "rgba(255,255,255,0.92)" : "text.secondary",
              }}
            >
              {description}
            </Typography>
          </Box>
        </Box>
      </Button>
    );
  };

  return (
    <Box>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mb: 1.75, fontWeight: 600, letterSpacing: "0.02em" }}
      >
        Быстрый выбор темы
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 0.5, sm: 1 },
        }}
      >
        <IconButton
          aria-label="Прокрутить темы назад"
          onClick={() => scrollByDir(-1)}
          disabled={!loaded || !canScrollLeft}
          sx={{
            alignSelf: "center",
            flexShrink: 0,
            color: "secondary.light",
            bgcolor: (t) => alpha(t.palette.background.paper, 0.85),
            border: 2,
            borderColor: (t) => alpha(t.palette.secondary.main, 0.35),
            transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
            "&:hover:not(:disabled)": {
              bgcolor: "action.hover",
              borderColor: "secondary.light",
              transform: "scale(1.06)",
              boxShadow: (t) => `0 4px 18px ${alpha(t.palette.secondary.main, 0.28)}`,
            },
            "&.Mui-disabled": { opacity: 0.35 },
          }}
        >
          <ChevronLeftRoundedIcon />
        </IconButton>

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
            py: 3.5,
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
                    fontSize: "0.96875rem",
                    fontWeight: 450,
                    color: isAll ? "rgba(255,255,255,0.92)" : "text.secondary",
                  }}
                >
                  {ALL_TOPICS_BUTTON_COPY.description}
                </Typography>
              </Box>
            </Box>
          </Button>

          {topics.map((t) => topicSlide(t))}
        </Box>

        <IconButton
          aria-label="Прокрутить темы вперёд"
          onClick={() => scrollByDir(1)}
          disabled={!loaded || !canScrollRight}
          sx={{
            alignSelf: "center",
            flexShrink: 0,
            color: "secondary.light",
            bgcolor: (t) => alpha(t.palette.background.paper, 0.85),
            border: 2,
            borderColor: (t) => alpha(t.palette.secondary.main, 0.35),
            transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
            "&:hover:not(:disabled)": {
              bgcolor: "action.hover",
              borderColor: "secondary.light",
              transform: "scale(1.06)",
              boxShadow: (t) => `0 4px 18px ${alpha(t.palette.secondary.main, 0.28)}`,
            },
            "&.Mui-disabled": { opacity: 0.35 },
          }}
        >
          <ChevronRightRoundedIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
