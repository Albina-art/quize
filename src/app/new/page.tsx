"use client";

import QuizPageShell from "@/components/QuizPageShell";
import SiteHeader from "@/components/SiteHeader";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { FormEvent, useState } from "react";

export default function NewCardPage() {
  const [topic, setTopic] = useState("");
  const [question, setQuestion] = useState("");
  const [hint, setHint] = useState("");
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [messageSeverity, setMessageSeverity] = useState<"success" | "error">(
    "success",
  );

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage("");

    const response = await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, question, hint: hint || undefined, answer }),
    });

    const data = (await response.json()) as { error?: string };

    if (!response.ok) {
      setMessageSeverity("error");
      setMessage(data.error ?? "Ошибка при сохранении.");
      return;
    }

    setTopic("");
    setQuestion("");
    setHint("");
    setAnswer("");
    setMessageSeverity("success");
    setMessage("Вопрос сохранён в базу.");
  }

  return (
    <QuizPageShell>
      <Stack spacing={3}>
        <SiteHeader
          title="Новая карточка"
          subtitle="Заполните тему, вопрос, при необходимости подсказку и ответ — затем сохраните в базу."
        />

        {message ? (
          <Alert severity={messageSeverity} variant="filled" sx={{ borderRadius: 2 }}>
            {message}
          </Alert>
        ) : null}

        <Card elevation={0}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Форма
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Все поля, кроме подсказки, обязательны для сохранения.
            </Typography>
            <Box component="form" onSubmit={onSubmit}>
              <Stack spacing={2}>
                <TextField
                  label="Тема"
                  placeholder="Например, CORS"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  required
                />
                <TextField
                  label="Вопрос"
                  placeholder="Формулировка для самопроверки"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  required
                  multiline
                  minRows={3}
                />
                <TextField
                  label="Подсказка"
                  placeholder="Необязательно"
                  value={hint}
                  onChange={(e) => setHint(e.target.value)}
                  multiline
                  minRows={2}
                />
                <TextField
                  label="Ответ"
                  placeholder="Развёрнутый ответ"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  required
                  multiline
                  minRows={4}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<AddRoundedIcon />}
                  sx={{ alignSelf: "flex-start", px: 3 }}
                >
                  Сохранить
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Stack>
    </QuizPageShell>
  );
}
