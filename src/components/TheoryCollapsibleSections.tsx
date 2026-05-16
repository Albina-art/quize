"use client";

import { useCallback, useState, type MouseEvent } from "react";
import MarkdownArticle from "@/components/MarkdownArticle";
import type { TheorySection } from "@/content/theory/theorySectionTypes";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

type Props = Readonly<{
  introMarkdown: string;
  sections: TheorySection[];
}>;

const COPIED_FEEDBACK_MS = 2000;

function CopyTextButton({
  text,
  label,
}: Readonly<{
  text: string;
  label: string;
}>) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        window.setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS);
      } catch {
        setCopied(false);
      }
    },
    [text],
  );

  return (
    <Tooltip title={copied ? "Скопировано" : label}>
      <IconButton
        size="small"
        onClick={handleCopy}
        aria-label={label}
        sx={{
          flexShrink: 0,
          color: copied ? "success.main" : "text.secondary",
          "&:hover": { color: copied ? "success.main" : "text.primary" },
        }}
      >
        {copied ? (
          <CheckRoundedIcon fontSize="small" />
        ) : (
          <ContentCopyRoundedIcon fontSize="small" />
        )}
      </IconButton>
    </Tooltip>
  );
}

export default function TheoryCollapsibleSections({ introMarkdown, sections }: Props) {
  return (
    <Stack spacing={2}>
      <MarkdownArticle source={introMarkdown} typographicQuotes />

      {sections.map((section, index) => (
        <Accordion
          key={section.title}
          defaultExpanded={false}
          disableGutters
          elevation={0}
          sx={{
            border: 1,
            borderColor: "divider",
            borderRadius: "6px !important",
            overflow: "hidden",
            bgcolor: "action.hover",
            "&:before": { display: "none" },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreRoundedIcon sx={{ color: "text.secondary" }} />}
            aria-controls={`theory-section-${index}`}
            id={`theory-section-header-${index}`}
            sx={{
              px: 2,
              py: 1.25,
              "& .MuiAccordionSummary-content": {
                my: 0.5,
                alignItems: "center",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flex: 1,
                minWidth: 0,
                gap: 0.5,
                pr: 1,
              }}
            >
              <Typography component="span" variant="subtitle1" sx={{ fontWeight: 600, flex: 1, minWidth: 0 }}>
                {section.title}
              </Typography>
              <CopyTextButton text={section.title} label="Скопировать заголовок" />
            </Box>
          </AccordionSummary>
          <AccordionDetails
            id={`theory-section-${index}`}
            sx={{
              px: { xs: 1.25, sm: 2 },
              pt: 0,
              pb: 2,
              borderTop: 1,
              borderColor: "divider",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
              <CopyTextButton text={section.body} label="Скопировать текст раздела" />
            </Box>
            <MarkdownArticle source={section.body} typographicQuotes embedded />
          </AccordionDetails>
        </Accordion>
      ))}
    </Stack>
  );
}
