"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { SxProps, Theme } from "@mui/material/styles";
import type { ReactNode } from "react";

export default function QuizPageShell({
  children,
  maxWidth = "lg",
  sx = {},
  sxContainer = {},
}: Readonly<{
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
  sx?: SxProps<Theme>;
  sxContainer?: SxProps<Theme>;
}>) {
  return (
    <Box
      sx={{
        ...sx,
        minHeight: "100vh",
        background: (t) =>
          `linear-gradient(165deg, ${t.palette.background.default} 0%, ${t.palette.background.paper} 44%, ${t.palette.background.default} 100%)`,
        pt: 0,
        pb: { xs: 2, sm: 4 },
        px: { xs: 0, sm: 2 },
      }}
    >
      <Container maxWidth={maxWidth} sx={sxContainer}>{children}</Container>
    </Box>
  );
}
