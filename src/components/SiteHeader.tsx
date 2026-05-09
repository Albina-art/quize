"use client";

import AddCardRoundedIcon from "@mui/icons-material/AddCardRounded";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import FactCheckRoundedIcon from "@mui/icons-material/FactCheckRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteHeader({
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
    <Stack spacing={2}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            sm: "repeat(3, 1fr)",
            md: "repeat(5, 1fr)",
          },
          gap: 1,
          width: "100%",
          maxWidth: 960,
          marginBottom: "20px !important",
        }}
      >
        <Button
          component={Link}
          href="/"
          variant={pathname === "/" ? "contained" : "outlined"}
          color={pathname === "/" ? "secondary" : "inherit"}
          size="medium"
          startIcon={<QuizRoundedIcon />}
          sx={{ width: "100%", justifyContent: "center" }}
        >
          Тренировка
        </Button>
        <Button
          component={Link}
          href="/mcq"
          variant={mcqActive ? "contained" : "outlined"}
          color={mcqActive ? "secondary" : "inherit"}
          size="medium"
          startIcon={<FactCheckRoundedIcon />}
          sx={{ width: "100%", justifyContent: "center" }}
        >
          Тест
        </Button>
        <Button
          component={Link}
          href="/new"
          variant={pathname === "/new" ? "contained" : "outlined"}
          color={pathname === "/new" ? "secondary" : "inherit"}
          size="medium"
          startIcon={<AddCardRoundedIcon />}
          sx={{ width: "100%", justifyContent: "center" }}
        >
          Новый
        </Button>
        <Button
          component={Link}
          href="/theory"
          variant={theoryActive ? "contained" : "outlined"}
          color={theoryActive ? "secondary" : "inherit"}
          size="medium"
          startIcon={<MenuBookRoundedIcon />}
          sx={{ width: "100%", justifyContent: "center" }}
        >
          Теория
        </Button>
        <Button
          component={Link}
          href="/notes"
          variant={notesActive ? "contained" : "outlined"}
          color={notesActive ? "secondary" : "inherit"}
          size="medium"
          startIcon={<EditNoteRoundedIcon />}
          sx={{ width: "100%", justifyContent: "center" }}
        >
          Заметки
        </Button>
      </Box>

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
    </Stack>
  );
}
