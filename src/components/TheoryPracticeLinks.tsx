import TheoryNavLink from "@/components/TheoryNavLink";
import { mcqUrlForTheorySlug, trainerUrlForTheorySlug } from "@/content/theory/topics";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

const linkSx = { fontWeight: 500, fontSize: "1.25rem" } as const;

type Props = Readonly<{
  slug: string;
  children?: ReactNode;
}>;

/** Ссылки на тренажёр (главная) и MCQ-тест по теме конспекта. */
export default function TheoryPracticeLinks({ slug, children }: Props) {
  const trainerHref = trainerUrlForTheorySlug(slug);
  const mcqHref = mcqUrlForTheorySlug(slug);

  if (!trainerHref && !mcqHref && !children) return null;

  return (
    <Stack spacing={1.25} component="nav" aria-label="Практика по теме">
      {children}
      {mcqHref && (
        <Typography variant="body1">
          <TheoryNavLink href={mcqHref} underline="hover" sx={linkSx}>
            Тест с вариантами ответа
          </TheoryNavLink>
        </Typography>
      )}
       {trainerHref && (
        <Typography variant="body1">
          <TheoryNavLink href={trainerHref} underline="hover" sx={linkSx}>
            Тренировка по теме
          </TheoryNavLink>
        </Typography>
      )}
    </Stack>
  );
}
