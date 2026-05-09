"use client";

import MarkdownArticle from "@/components/MarkdownArticle";
import type { TheorySection } from "@/content/theory/theorySectionTypes";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

type Props = Readonly<{
  introMarkdown: string;
  sections: TheorySection[];
}>;

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
              "& .MuiAccordionSummary-content": { my: 0.5, alignItems: "center" },
            }}
          >
            <Typography component="span" variant="subtitle1" sx={{ fontWeight: 600, pr: 1 }}>
              {section.title}
            </Typography>
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
            <MarkdownArticle source={section.body} typographicQuotes embedded />
          </AccordionDetails>
        </Accordion>
      ))}
    </Stack>
  );
}
