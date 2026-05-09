"use client";

import MarkdownArticle from "@/components/MarkdownArticle";
import QuizPageShell from "@/components/QuizPageShell";
import SiteHeader from "@/components/SiteHeader";
import { quizFetch } from "@/lib/quizFetch";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type ApiNote = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
};

const dateFmt = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

function noteListLabel(note: ApiNote): string {
  const t = note.title.trim();
  if (t) return t;
  const line = note.body.split("\n").find((l) => l.trim())?.trim() ?? "";
  if (line.startsWith("#")) return line.replace(/^#+\s*/, "").slice(0, 80) || "Без названия";
  return line.slice(0, 80) || "Без названия";
}

export default function NotesPage() {
  const [notes, setNotes] = useState<ApiNote[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [draftTitle, setDraftTitle] = useState("");
  const [draftBody, setDraftBody] = useState("");
  const [savePending, setSavePending] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [lastSavedLabel, setLastSavedLabel] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ApiNote | null>(null);
  const notesRef = useRef(notes);
  notesRef.current = notes;

  /** Подтягиваем текст с сервера только при переключении заметки (не при каждом обновлении списка). */
  useEffect(() => {
    const n = notesRef.current.find((x) => x.id === activeId);
    if (!n) {
      setDraftTitle("");
      setDraftBody("");
      return;
    }
    setDraftTitle(n.title);
    setDraftBody(n.body);
  }, [activeId]);

  const bootstrap = useCallback(async () => {
    setLoadError("");
    let res = await quizFetch("/api/notes");
    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as { error?: string };
      setLoadError(err.error ?? "Не удалось загрузить заметки.");
      setReady(true);
      return;
    }
    let data = (await res.json()) as { notes?: ApiNote[] };
    let list = data.notes ?? [];
    if (list.length === 0) {
      res = await quizFetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Первая заметка", body: "" }),
      });
      if (!res.ok) {
        setLoadError("Не удалось создать первую заметку.");
        setReady(true);
        return;
      }
      const created = (await res.json()) as ApiNote;
      list = [created];
    }
    setNotes(list);
    setActiveId((prev) => (prev && list.some((n) => n.id === prev) ? prev : list[0].id));
    setReady(true);
  }, []);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  const sortedNotes = useMemo(
    () => [...notes].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [notes],
  );

  const serverNote = useMemo(
    () => notes.find((n) => n.id === activeId),
    [notes, activeId],
  );

  const isDirty = Boolean(
    serverNote &&
      (draftTitle !== serverNote.title || draftBody !== serverNote.body),
  );

  const trySetActiveId = useCallback(
    (nextId: string) => {
      if (nextId === activeId) return;
      if (isDirty) {
        const ok = window.confirm(
          "Есть несохранённые изменения. Переключить заметку без сохранения?",
        );
        if (!ok) return;
      }
      setActiveId(nextId);
    },
    [activeId, isDirty],
  );

  const handleSave = useCallback(async () => {
    if (!activeId || !serverNote || !isDirty) return;
    setSaveError("");
    setSavePending(true);
    try {
      const res = await quizFetch(`/api/notes/${activeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: draftTitle,
          body: draftBody,
        }),
      });
      const payload = (await res.json().catch(() => ({}))) as ApiNote & {
        error?: string;
      };
      if (!res.ok) {
        setSaveError(payload.error ?? "Не удалось сохранить.");
        return;
      }
      if (payload.id && payload.id === activeId) {
        setNotes((prev) =>
          prev.map((n) => (n.id === payload.id ? payload : n)),
        );
      }
      setLastSavedLabel(
        new Intl.DateTimeFormat("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }).format(new Date()),
      );
    } finally {
      setSavePending(false);
    }
  }, [activeId, serverNote, isDirty, draftTitle, draftBody]);

  const createNote = useCallback(async () => {
    if (isDirty) {
      const ok = window.confirm(
        "Есть несохранённые изменения. Создать новую заметку без сохранения текущей?",
      );
      if (!ok) return;
    }
    const res = await quizFetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Новая заметка", body: "" }),
    });
    if (!res.ok) return;
    const n = (await res.json()) as ApiNote;
    setNotes((prev) => [n, ...prev]);
    setActiveId(n.id);
    setDrawerOpen(false);
  }, [isDirty]);

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    setDeleteTarget(null);
    const res = await quizFetch(`/api/notes/${id}`, { method: "DELETE" });
    if (!res.ok) return;
    await bootstrap();
  }, [deleteTarget, bootstrap]);

  const renderNoteList = (inDrawer: boolean) => (
    <Box
      sx={{
        width: inDrawer ? 280 : "100%",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        maxHeight: inDrawer ? "100%" : undefined,
      }}
    >
      <Button
        fullWidth
        variant="contained"
        color="secondary"
        startIcon={<AddRoundedIcon />}
        onClick={() => void createNote()}
        sx={{ mb: 1.5 }}
      >
        Новая заметка
      </Button>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.75, px: 0.5 }}>
        Все заметки ({sortedNotes.length})
      </Typography>
      <List
        dense
        disablePadding
        sx={{
          overflow: "auto",
          flex: inDrawer ? 1 : "none",
          maxHeight: inDrawer ? "calc(100vh - 200px)" : 360,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          bgcolor: "background.paper",
        }}
      >
        {sortedNotes.map((note) => (
          <ListItem
            key={note.id}
            disablePadding
            divider
            secondaryAction={
              <Tooltip title="Удалить">
                <IconButton
                  edge="end"
                  size="small"
                  aria-label="Удалить заметку"
                  onClick={() => setDeleteTarget(note)}
                >
                  <DeleteOutlineRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            }
          >
            <ListItemButton
              selected={note.id === activeId}
              onClick={() => {
                trySetActiveId(note.id);
                if (inDrawer) setDrawerOpen(false);
              }}
              sx={{
                alignItems: "flex-start",
                py: 1.25,
                pr: "40px !important",
              }}
            >
              <ListItemText
                primary={noteListLabel(note)}
                secondary={dateFmt.format(new Date(note.updatedAt))}
                slotProps={{
                  primary: {
                    noWrap: true,
                    sx: { fontWeight: note.id === activeId ? 600 : 500 },
                  },
                  secondary: { variant: "caption" },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const editorField = (
    <TextField
      multiline
      fullWidth
      minRows={16}
      maxRows={40}
      value={draftBody}
      onChange={(e) => setDraftBody(e.target.value)}
      placeholder={
        "# Заголовок\n\nПишите в Markdown (таблицы, списки задач — GFM)."
      }
      disabled={!ready || !serverNote}
      slotProps={{
        input: {
          sx: {
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            fontSize: "0.9375rem",
            lineHeight: 1.65,
          },
        },
      }}
    />
  );

  return (
    <QuizPageShell maxWidth="xl">
      <Stack spacing={2.5}>
        <SiteHeader
          title="Заметки"
          subtitle="Markdown в базе данных. Сохранение вручную кнопкой «Сохранить». Идентификатор браузера задаётся заголовком X-Quiz-Device-Id."
        />

        {loadError ? (
          <Typography color="error" variant="body2">
            {loadError}
          </Typography>
        ) : null}

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{
            alignItems: { xs: "stretch", sm: "center" },
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
            {!ready
              ? "Загрузка…"
              : savePending
                ? "Сохранение…"
                : isDirty
                  ? "Изменения не сохранены на сервер."
                  : lastSavedLabel
                    ? `Последнее сохранение: ${lastSavedLabel}`
                    : "Нет несохранённых изменений."}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            disabled={!ready || !serverNote || !isDirty || savePending}
            startIcon={<SaveRoundedIcon />}
            onClick={() => void handleSave()}
            sx={{ alignSelf: { xs: "stretch", sm: "center" } }}
          >
            Сохранить
          </Button>
        </Stack>
        {saveError ? (
          <Typography color="error" variant="body2">
            {saveError}
          </Typography>
        ) : null}

        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "flex-start",
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Box sx={{ display: { xs: "none", md: "block" }, width: 280 }}>
            <Card elevation={0} sx={{ position: "sticky", top: 16 }}>
              <CardContent sx={{ p: 2 }}>{renderNoteList(false)}</CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: 1, minWidth: 0, width: "100%" }}>
            <Stack spacing={2}>
              <TextField
                label="Название"
                fullWidth
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                disabled={!ready || !serverNote}
                size="small"
              />

              <Box
                sx={{
                  display: { xs: "none", md: "grid" },
                  gridTemplateColumns: { md: "1fr 1fr" },
                  gap: 2,
                  alignItems: "start",
                }}
              >
                <Card elevation={0} sx={{ minHeight: 480 }}>
                  <CardContent
                    sx={{
                      p: { xs: 2, sm: 2.5 },
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      "&:last-child": { pb: { xs: 2, sm: 2.5 } },
                    }}
                  >
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Редактор
                    </Typography>
                    {editorField}
                  </CardContent>
                </Card>
                <Card elevation={0} sx={{ minHeight: 480 }}>
                  <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>
                      Просмотр
                    </Typography>
                    {draftBody.trim() ? (
                      <MarkdownArticle source={draftBody} />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Здесь появится отформатированный текст.
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Box>

              <Box sx={{ display: { xs: "block", md: "none" } }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setDrawerOpen(true)}
                  sx={{ mb: 1 }}
                >
                  Список заметок
                </Button>
                <Tabs
                  value={mobileTab}
                  onChange={(_, v) => setMobileTab(v)}
                  aria-label="Режим заметок"
                  sx={{
                    minHeight: 42,
                    "& .MuiTab-root": { textTransform: "none", fontWeight: 600 },
                  }}
                >
                  <Tab label="Редактор" value="edit" />
                  <Tab label="Просмотр" value="preview" />
                </Tabs>
                <Box sx={{ pt: 2 }}>
                  {mobileTab === "edit" ? (
                    editorField
                  ) : draftBody.trim() ? (
                    <MarkdownArticle source={draftBody} />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Здесь появится отформатированный текст.
                    </Typography>
                  )}
                </Box>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Stack>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{
          paper: { sx: { width: 300, p: 2, boxSizing: "border-box" } },
        }}
      >
        <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 600 }}>
          Заметки
        </Typography>
        {renderNoteList(true)}
      </Drawer>

      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Удалить заметку?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            «{deleteTarget ? noteListLabel(deleteTarget) : ""}» будет удалена из базы.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteTarget(null)}>Отмена</Button>
          <Button color="error" variant="contained" onClick={() => void confirmDelete()}>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </QuizPageShell>
  );
}
