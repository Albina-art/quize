"use client";

import SiteNavShell from "@/components/SiteNavShell";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import type { ReactNode } from "react";

/** Общая шапка с навигацией: живёт в корневом layout, не пересоздаётся при смене маршрута. */
export default function AppChrome({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <Box
        sx={{
          pt: { xs: 0, sm: 2 },
          px: { xs: 2, sm: 2 },
          pb: 0,
        }}
      >
        <Container maxWidth="lg">
          <SiteNavShell />
        </Container>
      </Box>
      {children}
    </>
  );
}
