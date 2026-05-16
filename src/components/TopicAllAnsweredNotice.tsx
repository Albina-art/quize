"use client";

import { topicButtonCopy } from "@/content/topicDisplay";
import { TOPIC_ALL_ANSWERED_MESSAGE } from "@/lib/topicQuestionPool";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

type Props = Readonly<{
  currentTopic: string;
  topics: string[];
  allTopicsValue?: string;
  onRetake: () => void;
  onSelectTopic: (topic: string) => void;
}>;

export default function TopicAllAnsweredNotice({
  currentTopic,
  topics,
  allTopicsValue = "",
  onRetake,
  onSelectTopic,
}: Props) {
  const otherTopics = topics.filter((t) => t !== currentTopic);
  const { title: currentTitle } = topicButtonCopy(currentTopic);

  return (
    <Stack
      spacing={2.5}
      sx={{
        flex: 1,
        minHeight: { xs: 200, sm: 280 },
        py: 4,
        alignItems: "stretch",
        justifyContent: "center",
        maxWidth: 420,
        mx: "auto",
        width: "100%",
      }}
    >
      <Alert severity="info" variant="outlined" sx={{ borderRadius: 2 }}>
        {TOPIC_ALL_ANSWERED_MESSAGE}
      </Alert>

      <Button
        variant="contained"
        color="secondary"
        size="large"
        fullWidth
        startIcon={<ReplayRoundedIcon />}
        onClick={onRetake}
        sx={{ textTransform: "none", py: 1.35 }}
      >
        Пройти «{currentTitle}» ещё раз
      </Button>

      {otherTopics.length > 0 ? (
        <Box>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.25, fontWeight: 600 }}>
            Или перейти к другой теме
          </Typography>
          <Stack spacing={0.75}>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              endIcon={<ChevronRightRoundedIcon />}
              onClick={() => onSelectTopic(allTopicsValue)}
              sx={{ justifyContent: "space-between", textTransform: "none", py: 1.25 }}
            >
              Все темы
            </Button>
            {otherTopics.map((topic) => {
              const { title } = topicButtonCopy(topic);
              return (
                <Button
                  key={topic}
                  variant="outlined"
                  color="inherit"
                  fullWidth
                  endIcon={<ChevronRightRoundedIcon />}
                  onClick={() => onSelectTopic(topic)}
                  sx={{ justifyContent: "space-between", textTransform: "none", py: 1.25 }}
                >
                  {title}
                </Button>
              );
            })}
          </Stack>
        </Box>
      ) : (
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          endIcon={<ChevronRightRoundedIcon />}
          onClick={() => onSelectTopic(allTopicsValue)}
          sx={{ justifyContent: "space-between", textTransform: "none", py: 1.25 }}
        >
          Все темы
        </Button>
      )}
    </Stack>
  );
}
