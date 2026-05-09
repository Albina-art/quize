import { Suspense } from "react";
import LoginPageClient from "./LoginPageClient";
import QuizPageShell from "@/components/QuizPageShell";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

function LoginFallback() {
  return (
    <QuizPageShell maxWidth="sm">
      <Typography variant="body2" color="text.secondary">
        Загрузка…
      </Typography>
    </QuizPageShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginPageClient />
    </Suspense>
  );
}
