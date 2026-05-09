"use client";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkSmartypants from "remark-smartypants";

const THEORY_SMARTYPANTS = {
  backticks: false,
  dashes: false,
  ellipses: false,
  quotes: true,
  openingQuotes: { double: "«", single: "‘" },
  closingQuotes: { double: "»", single: "’" },
} as const;

/** Основной текст как у блока «Ответ» на тренировке (page.tsx) */
const answerBody = {
  fontSize: "1.1875rem",
  fontWeight: 400,
  lineHeight: 1.75,
  color: "text.primary",
};

const read = {
  body: answerBody,
  h1: {
    fontSize: { xs: "1.75rem", sm: "2.125rem" },
    lineHeight: 1.28,
    fontWeight: 600,
    letterSpacing: "-0.02em",
    color: "text.primary",
  },
  h2: {
    fontSize: { xs: "1.35rem", sm: "1.5rem" },
    lineHeight: 1.33,
    fontWeight: 600,
    letterSpacing: "-0.01em",
    color: "text.primary",
  },
  h3: {
    fontSize: "1.3125rem",
    lineHeight: 1.38,
    fontWeight: 600,
    color: "text.primary",
  },
  h4: {
    fontSize: "1.1875rem",
    lineHeight: 1.45,
    fontWeight: 600,
    color: "text.primary",
  },
  listItem: {
    ...answerBody,
    letterSpacing: "0.01em",
    display: "list-item",
  },
  tableCell: {
    fontSize: "1.0625rem",
    lineHeight: 1.55,
    py: 1.35,
    px: 1.5,
    color: "text.primary",
  },
};

const components: Components = {
  h1: ({ children }) => (
    <Typography component="h1" sx={{ mt: 0, mb: 2.5, ...read.h1 }}>
      {children}
    </Typography>
  ),
  h2: ({ children }) => (
    <Typography component="h2" sx={{ mt: 4, mb: 2, ...read.h2 }}>
      {children}
    </Typography>
  ),
  h3: ({ children }) => (
    <Typography component="h3" sx={{ mt: 3, mb: 1.25, ...read.h3 }}>
      {children}
    </Typography>
  ),
  h4: ({ children }) => (
    <Typography component="h4" sx={{ mt: 2.5, mb: 1, ...read.h4 }}>
      {children}
    </Typography>
  ),
  /** `div`: в Markdown картинки часто попадают в «параграф»; наш `img`-рендер использует `<figure>`, недопустимый внутри `<p>` (SSR/гидратация). */
  p: ({ children }) => (
    <Typography component="div" role="paragraph" sx={{ mb: 2, ...read.body }}>
      {children}
    </Typography>
  ),
  ul: ({ children }) => (
    <Box component="ul" sx={{ m: 0, mb: 2 }}>
      {children}
    </Box>
  ),
  ol: ({ children }) => (
    <Box component="ol" sx={{ m: 0, mb: 2 }}>
      {children}
    </Box>
  ),
  li: ({ children }) => (
    <Box component="li" sx={read.listItem}>
      {children}
    </Box>
  ),
  a: ({ href, children }) => {
    const u = href ?? "#";
    const isHash = u.startsWith("#");
    const isInternal = u.startsWith("/") && !u.startsWith("//");
    return (
      <Link
        href={u}
        color="secondary"
        underline="hover"
        target={isHash || isInternal ? undefined : "_blank"}
        rel={isHash || isInternal ? undefined : "noopener noreferrer"}
        sx={{ fontWeight: 500 }}
      >
        {children}
      </Link>
    );
  },
  img: ({ src, alt }) => {
    if (!src) return null;
    return (
      <Box
        component="figure"
        sx={{ m: 0, mb: 2.5, maxWidth: "100%" }}
      >
        <Box
          component="img"
          src={src}
          alt={alt ?? ""}
          loading="lazy"
          decoding="async"
          sx={{
            maxWidth: "100%",
            height: "auto",
            display: "block",
            mx: "auto",
            borderRadius: "6px",
            border: "1px solid",
            borderColor: "divider",
          }}
        />
      </Box>
    );
  },
  /** Fenced ```…```: один блок с фоном; весь текст (кавычки, URL) — как есть, без обрезки. */
  pre: ({ children }) => (
    <Paper
      component="div"
      variant="outlined"
      sx={{
        mb: 2.5,
        overflow: "auto",
        maxWidth: "100%",
        borderRadius: "6px",
        bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(177, 186, 196, 0.14)" : "action.hover"),
        borderColor: "divider",
        p: 2.25,
      }}
    >
      {children}
    </Paper>
  ),
  code: ({ className, children }) => {
    const isFenced = Boolean(className?.startsWith("language-"));
    if (isFenced) {
      return (
        <Box
          component="code"
          className={className}
          sx={{
            display: "block",
            m: 0,
            p: 0,
            width: "100%",
            boxSizing: "border-box",
            whiteSpace: "pre-wrap",
            overflowWrap: "anywhere",
            wordBreak: "break-word",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            fontSize: "1.0625rem",
            lineHeight: 1.65,
            color: "text.primary",
            bgcolor: "transparent",
          }}
        >
          {children}
        </Box>
      );
    }
    return (
      <Box
        component="code"
        sx={{
          px: 0.85,
          py: 0.35,
          borderRadius: "4px",
          bgcolor: "action.hover",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          fontSize: "0.95em",
          whiteSpace: "pre-wrap",
          overflowWrap: "anywhere",
          wordBreak: "break-word",
        }}
      >
        {children}
      </Box>
    );
  },
  blockquote: ({ children }) => (
    <Box
      sx={{
        borderLeft: "4px solid",
        borderColor: "divider",
        pl: 2.5,
        py: 1,
        mb: 2.5,
        ...answerBody,
        color: "text.secondary",
      }}
    >
      {children}
    </Box>
  ),
  hr: () => <Box sx={{ my: 4, border: 0, borderTop: "1px solid", borderColor: "divider" }} />,
  table: ({ children }) => (
    <TableContainer
      component={Paper}
      variant="outlined"
      sx={{ mb: 2.5, borderRadius: "6px", overflow: "auto" }}
    >
      <Table size="medium">{children}</Table>
    </TableContainer>
  ),
  thead: ({ children }) => <TableHead>{children}</TableHead>,
  tbody: ({ children }) => <TableBody>{children}</TableBody>,
  tr: ({ children }) => <TableRow>{children}</TableRow>,
  th: ({ children }) => (
    <TableCell sx={{ ...read.tableCell, fontWeight: 700, bgcolor: "action.hover" }}>
      {children}
    </TableCell>
  ),
  td: ({ children }) => <TableCell sx={{ ...read.tableCell, fontWeight: 400 }}>{children}</TableCell>,
};

/** Иерархия как в конспекте: уровень 1 — заполненный круг, 2 — пустой, 3+ — квадрат; каждый уровень сдвигается вправо */
const listHierarchySx = {
  "& ul": {
    m: 0,
    mb: 2,
    pl: "1.75em",
    listStyleType: "disc",
    listStylePosition: "outside",
  },
  "& ul ul": {
    mt: 1,
    mb: 0,
    ml: "1.35em",
    pl: "1.35em",
    listStyleType: "circle",
    listStylePosition: "outside",
  },
  "& ul ul ul": {
    ml: "1.25em",
    pl: "1.25em",
    listStyleType: "square",
  },
  "& ul ul ul ul": {
    ml: "1.15em",
    listStyleType: "disc",
  },
  "& ol": {
    m: 0,
    mb: 2,
    pl: "1.75em",
    listStyleType: "decimal",
    listStylePosition: "outside",
  },
  "& ol ol": {
    mt: 1,
    mb: 0,
    ml: "1.35em",
    pl: "1.35em",
    listStyleType: "lower-alpha",
  },
  "& ol ol ol": {
    ml: "1.25em",
    listStyleType: "lower-roman",
  },
  "& li": {
    display: "list-item",
  },
  "& ul > li, & ol > li": {
    mb: 1,
  },
  "& li p": {
    mb: 0.75,
    "&:last-child": { mb: 0 },
  },
} as const;

export default function MarkdownArticle({
  source,
  typographicQuotes = false,
  embedded = false,
}: Readonly<{
  source: string;
  /** Только для конспектов теории (`/theory/…`): русские «ёлочки» вместо прямых кавычек в тексте. */
  typographicQuotes?: boolean;
  /** Внутри аккордеона: без отдельной «карточки», только типографика. */
  embedded?: boolean;
}>) {
  return (
    <Box
      sx={{
        maxWidth: "100%",
        ...(embedded ?
          {
            p: 0,
            bgcolor: "transparent",
            border: "none",
          }
        : {
            p: 2.25,
            borderRadius: "6px",
            bgcolor: "action.hover",
            border: "1px solid",
            borderColor: "divider",
          }),
        color: "text.primary",
        "& strong": { fontWeight: 600, color: "text.primary" },
        ...listHierarchySx,
      }}
    >
      {typographicQuotes ? (
        <ReactMarkdown
          remarkPlugins={[remarkGfm, [remarkSmartypants, THEORY_SMARTYPANTS]]}
          components={components}
        >
          {source}
        </ReactMarkdown>
      ) : (
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
          {source}
        </ReactMarkdown>
      )}
    </Box>
  );
}
