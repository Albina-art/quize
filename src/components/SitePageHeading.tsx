"use client";

import FactCheckRoundedIcon from "@mui/icons-material/FactCheckRounded";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { usePathname } from "next/navigation";

export default function SitePageHeading({
  title,
  subtitle,
}: Readonly<{
  title: string;
  subtitle?: string;
}>) {
  const pathname = usePathname();
  const theoryActive = pathname.startsWith("/theory");
  const mcqActive = pathname === "/mcq";
  const notesActive = pathname === "/notes";

  return (
    <Stack spacing={1} sx={{ alignItems: "flex-start" }}>
      <Chip
        icon={
          theoryActive ? (
            <MenuBookRoundedIcon />
          ) : mcqActive ? (
            <FactCheckRoundedIcon />
          ) : notesActive ? (
            <EditNoteRoundedIcon />
          ) : (
            <QuizRoundedIcon />
          )
        }
        label={
          theoryActive
            ? "Теория · конспекты"
            : mcqActive
              ? "Тест · варианты ответов"
              : notesActive
                ? "Заметки · Markdown"
                : "PostgreSQL · случайная выдача"
        }
        color="secondary"
        variant="outlined"
        size="medium"
        sx={{ borderRadius: "6px", fontWeight: 500 }}
      />
      <Typography
        variant="h4"
        component="h1"
        sx={{
          ...(theoryActive && {
            fontSize: { xs: "2rem", sm: "2.35rem" },
            lineHeight: 1.25,
          }),
          background: (t) =>
            `linear-gradient(120deg, ${t.palette.secondary.light}, white)`,
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {title}
      </Typography>
      {subtitle ? (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            maxWidth: theoryActive ? 680 : 580,
            ...(theoryActive && {
              fontSize: "1.25rem",
              lineHeight: 1.68,
            }),
          }}
        >
          {subtitle}
        </Typography>
      ) : null}
    </Stack>
  );
}
