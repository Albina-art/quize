import { Suspense } from "react";
import RegisterPageClient from "./RegisterPageClient";
import QuizPageShell from "@/components/QuizPageShell";
import Typography from "@mui/material/Typography";

function RegisterFallback() {
  return (
    <QuizPageShell maxWidth="sm">
      <Typography variant="body2" color="text.secondary">
        Загрузка…
      </Typography>
    </QuizPageShell>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterFallback />}>
      <RegisterPageClient />
    </Suspense>
  );
}
