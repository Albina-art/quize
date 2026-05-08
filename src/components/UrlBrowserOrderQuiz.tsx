"use client";

import {
  DndContext,
  closestCenter,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useCallback, useMemo, useState } from "react";
import {
  type UrlBrowserOrderStep,
  urlBrowserOrderCorrectIds,
  urlBrowserOrderInitialIds,
  stepsFromIds,
} from "@/content/theory/urlBrowserOrderSteps";

function SortableStepRow({ step }: { step: UrlBrowserOrderStep }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Paper
      ref={setNodeRef}
      elevation={0}
      sx={{
        display: "flex",
        gap: 1.25,
        alignItems: "flex-start",
        p: { xs: 1.25, sm: 1.75 },
        border: 1,
        borderColor: "divider",
        bgcolor: "action.hover",
        cursor: isDragging ? "grabbing" : "grab",
        opacity: isDragging ? 0.92 : 1,
        boxShadow: isDragging ? 4 : 0,
      }}
      style={style}
    >
      <Box
        {...attributes}
        {...listeners}
        sx={{
          color: "text.secondary",
          display: "flex",
          alignItems: "center",
          mt: 0.25,
          touchAction: "none",
        }}
        aria-hidden
      >
        <DragIndicatorIcon fontSize="small" />
      </Box>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography variant="subtitle1" component="p" sx={{ fontWeight: 600 }}>
          {step.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {step.description}
        </Typography>
      </Box>
    </Paper>
  );
}

export default function UrlBrowserOrderQuiz() {
  const initialItems = useMemo(
    () => stepsFromIds(urlBrowserOrderInitialIds),
    [],
  );
  const [items, setItems] = useState<UrlBrowserOrderStep[]>(initialItems);
  const [checked, setChecked] = useState<"idle" | "success" | "error">("idle");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setChecked("idle");
    if (!over || active.id === over.id) return;
    setItems((prev) => {
      const oldIndex = prev.findIndex((i) => i.id === active.id);
      const newIndex = prev.findIndex((i) => i.id === over.id);
      if (oldIndex < 0 || newIndex < 0) return prev;
      return arrayMove(prev, oldIndex, newIndex);
    });
  }, []);

  const handleCheck = useCallback(() => {
    const ok = items.every(
      (item, i) => item.id === urlBrowserOrderCorrectIds[i],
    );
    setChecked(ok ? "success" : "error");
  }, [items]);

  const handleReset = useCallback(() => {
    setItems(stepsFromIds(urlBrowserOrderInitialIds));
    setChecked("idle");
  }, []);

  return (
    <Stack spacing={2.5}>
      <Typography variant="body1" color="text.secondary">
        Расставьте этапы в том порядке, в каком они происходят при открытии
        страницы по URL. Перетаскивайте карточки за ручку слева.
      </Typography>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <Stack spacing={1.5} component="ol" sx={{ m: 0, p: 0, listStyle: "none" }}>
            {items.map((step) => (
              <Box component="li" key={step.id}>
                <SortableStepRow step={step} />
              </Box>
            ))}
          </Stack>
        </SortableContext>
      </DndContext>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
        <Button variant="contained" color="primary" onClick={handleCheck}>
          Проверить
        </Button>
        <Button variant="outlined" color="inherit" onClick={handleReset}>
          Сбросить порядок
        </Button>
      </Stack>

      {checked === "success" && (
        <Alert severity="success">
          Верно: сначала DNS, затем TCP, HTTPS и запрос, обработка на сервере,
          потом отрисовка в браузере.
        </Alert>
      )}
      {checked === "error" && (
        <Alert severity="error">
          Порядок пока неверный. Подсказка: до шифрования и HTTP нужен «канал»
          — это TCP; первым всегда превращение имени сайта в IP.
        </Alert>
      )}
    </Stack>
  );
}
