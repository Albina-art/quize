"use client";

import { theoryUrlForQuestionTopic } from "@/content/theory/topics";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import MuiLink from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { alpha, type Theme } from "@mui/material/styles";
import Link from "next/link";

type Props = Readonly<{
  topic: string;
}>;

const plainSx = { margin: "0 !important", fontWeight: 600 } as const;

const linkSx = {
  margin: "0 !important",
  display: "inline-flex",
  alignItems: "center",
  gap: 0.5,
  fontWeight: 600,
  fontSize: "1.0625rem",
  lineHeight: 1.4,
  color: "secondary.light",
  textDecoration: "underline",
  textDecorationColor: (theme: Theme) => alpha(theme.palette.secondary.light, 0.45),
  textUnderlineOffset: "0.2em",
  "&:hover": {
    color: "secondary.main",
    textDecorationColor: "secondary.main",
  },
  "& .MuiSvgIcon-root": {
    fontSize: "1.125rem",
  },
} as const;

/** Тема вопроса; при наличии конспекта — ссылка на `/theory/...`. */
export default function QuestionTopicChip({ topic }: Props) {
  const theoryHref = theoryUrlForQuestionTopic(topic);

  if (!theoryHref) {
    return (
      <Typography component="span" variant="body1" color="text.primary" sx={plainSx}>
        {topic}
      </Typography>
    );
  }

  return (
    <Tooltip title="Открыть конспект по теме">
      <MuiLink component={Link} href={theoryHref} underline="none" sx={linkSx}>
        <MenuBookRoundedIcon aria-hidden />
        {topic}
      </MuiLink>
    </Tooltip>
  );
}
