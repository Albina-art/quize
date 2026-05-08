"use client";

import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

export default function QuizPageShell({
  children,
  maxWidth = "lg",
}: Readonly<{
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg";
}>) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: (t) =>
          `linear-gradient(165deg, ${t.palette.background.default} 0%, ${t.palette.background.paper} 44%, ${t.palette.background.default} 100%)`,
        py: { xs: 2, sm: 4 },
        px: { xs: 1.5, sm: 2 },
      }}
    >
      <Container maxWidth={maxWidth}>{children}</Container>
    </Box>
  );
}
