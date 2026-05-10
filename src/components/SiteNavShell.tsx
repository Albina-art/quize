"use client";

import AuthSessionBar from "@/components/AuthSessionBar";
import AddCardRoundedIcon from "@mui/icons-material/AddCardRounded";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import FactCheckRoundedIcon from "@mui/icons-material/FactCheckRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Link from "next/link";
import { usePathname } from "next/navigation";

/** Постоянная навигация: не размонтируется при переходах между страницами. */
export default function SiteNavShell() {
  const pathname = usePathname();
  const theoryActive = pathname.startsWith("/theory");
  const mcqActive = pathname === "/mcq";
  const notesActive = pathname === "/notes";

  return (
    <Stack spacing={2}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          width: "100%",
        }}
      >
        <AuthSessionBar />
      </Box>
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
    </Stack>
  );
}
