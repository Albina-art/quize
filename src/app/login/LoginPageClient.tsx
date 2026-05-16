"use client";

import { safeRedirectPath } from "@/lib/auth/safeRedirectPath";
import { quizFetch } from "@/lib/quizFetch";
import QuizPageShell from "@/components/QuizPageShell";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeRedirectPath(searchParams.get("next"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await quizFetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Не удалось войти.");
        setLoading(false);
        return;
      }
      window.dispatchEvent(new CustomEvent("quiz-auth-changed"));
      router.replace(next);
      router.refresh();
    } catch {
      setError("Сеть недоступна или сервер ответил с ошибкой.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <QuizPageShell maxWidth="sm" sxContainer={{ pt: {xs: 2, sm: 5} }}>
      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack spacing={2} component="form" onSubmit={onSubmit}>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
              Вход
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Нужен аккаунт для тренировки, теста и заметок.{" "}
              <Link
                component={NextLink}
                href={next === "/" ? "/register" : `/register?next=${encodeURIComponent(next)}`}
                underline="always"
              >
                Регистрация
              </Link>
            </Typography>
            {error ? <Alert severity="error">{error}</Alert> : null}
            <TextField
              label="Email"
              type="email"
              autoComplete="email"
              required
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Пароль"
              type="password"
              autoComplete="current-password"
              required
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" variant="contained" color="secondary" disabled={loading} size="large">
              Войти
            </Button>
            <Button component={NextLink} href="/theory" color="inherit" size="small">
              Без аккаунта доступна только теория
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </QuizPageShell>
  );
}
