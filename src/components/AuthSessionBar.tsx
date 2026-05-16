"use client";

import { quizFetch } from "@/lib/quizFetch";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type MeUser = { id: string; email: string };

export default function AuthSessionBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<MeUser | null | undefined>(undefined);

  const refresh = useCallback(async () => {
    try {
      const res = await quizFetch("/api/auth/me");
      const data = (await res.json()) as { user?: MeUser | null };
      setUser(data.user ?? null);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh, pathname]);

  useEffect(() => {
    const onEv = () => void refresh();
    window.addEventListener("quiz-auth-changed", onEv);
    return () => window.removeEventListener("quiz-auth-changed", onEv);
  }, [refresh]);

  const onLogout = async () => {
    await quizFetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.dispatchEvent(new CustomEvent("quiz-auth-changed"));
    if (pathname.startsWith("/login") || pathname.startsWith("/register")) return;
    router.push("/login");
    router.refresh();
  };

  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    return null;
  }

  if (user === undefined) {
    return (
      <Typography variant="caption" color="text.secondary" sx={{ px: 0.5 }}>
        …
      </Typography>
    );
  }

  if (user) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 1,
          marginLeft: "auto",
          maxWidth: "max-content",
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 220 }} noWrap title={user.email}>
          {user.email}
        </Typography>
        <Tooltip title="Выйти">
          <IconButton
            size="small"
            aria-label="Выйти"
            onClick={() => void onLogout()}
            sx={(theme) => ({
              display: "inline-flex",
              [theme.breakpoints.up(768)]: { display: "none" },
              border: 1,
              borderColor: "divider",
              color: "inherit",
            })}
          >
            <LogoutRoundedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Button
          size="small"
          variant="outlined"
          color="inherit"
          onClick={() => void onLogout()}
          sx={(theme) => ({
            display: "none",
            [theme.breakpoints.up(768)]: { display: "inline-flex" },
          })}
        >
          Выйти
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 1,
      }}
    >
      <Button component={Link} href="/login" size="small" variant="outlined" color="secondary">
        Вход
      </Button>
      <Button component={Link} href="/register" size="small" variant="contained" color="secondary">
        Регистрация
      </Button>
    </Box>
  );
}
