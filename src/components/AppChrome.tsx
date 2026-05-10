"use client";

import SiteNavShell from "@/components/SiteNavShell";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

/** Общая шапка с навигацией: живёт в корневом layout, не пересоздаётся при смене маршрута. */
export default function AppChrome({
  children,
}: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();
  const navMaxWidth = pathname.startsWith("/theory") ? "xl" : "lg";

  return (
    <>
      <Box
        sx={{
          pt: { xs: 2, sm: 4 },
          px: { xs: 0, sm: 2 },
          pb: { xs: 2, sm: 2 },
        }}
      >
        <Container maxWidth={navMaxWidth}>
          <SiteNavShell />
        </Container>
      </Box>
      {children}
    </>
  );
}
