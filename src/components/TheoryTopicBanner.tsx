import Box from "@mui/material/Box";
import Image from "next/image";
import { theoryTopics } from "@/content/theory/topics";

export type TheoryTopicBannerProps = {
  /** Slug темы из `theoryTopics` — показываем её `illustration`. */
  slug: string;
};

/** Иллюстрация темы как баннер (как на `/theory`, но на всю ширину контента). */
export default function TheoryTopicBanner({ slug }: TheoryTopicBannerProps) {
  const topic = theoryTopics.find((t) => t.slug === slug);
  const src = topic?.illustration;
  if (!src) return null;

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: { xs: 180, sm: 420 },
        borderRadius: 1,
        overflow: "hidden",
        bgcolor: "action.hover",
        border: 1,
        borderColor: "divider",
      }}
    >
      <Image
        src={src}
        alt=""
        fill
        sizes="(max-width: 1536px) 100vw, 1536px"
        style={{ objectFit: "contain" }}
        priority
      />
    </Box>
  );
}
