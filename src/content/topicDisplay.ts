/** Идентификатор иконки для кнопок темы (см. TopicChipFilter). */
export type TopicVisualIcon =
  | "all"
  | "https"
  | "cors"
  | "browser"
  | "default";

/** Короткие заголовки, пояснения и иконки (ключ = строка topic из БД). */
export const TOPIC_BUTTON_COPY: Record<
  string,
  { title: string; description: string; icon: TopicVisualIcon }
> = {
  "HTTPS / TCP / TLS": {
    title: "HTTPS · TLS",
    description: "Порты, сертификаты, рукопожатие и шифрование трафика",
    icon: "https",
  },
  CORS: {
    title: "CORS",
    description: "Кросс-доменные запросы, заголовки и политика браузера",
    icon: "cors",
  },
  "Браузер: от URL до экрана": {
    title: "От URL до экрана",
    description: "DNS, TCP, HTTPS и отрисовка страницы в браузере",
    icon: "browser",
  },
};

export const ALL_TOPICS_BUTTON_COPY = {
  title: "Все темы",
  description: "Случайная карточка из любой темы в базе",
  icon: "all" as const satisfies TopicVisualIcon,
};

export function topicButtonCopy(canonicalTopic: string): {
  title: string;
  description: string;
  icon: TopicVisualIcon;
} {
  const hit = TOPIC_BUTTON_COPY[canonicalTopic];
  if (hit) return hit;
  return {
    title:
      canonicalTopic.length > 42
        ? `${canonicalTopic.slice(0, 40)}…`
        : canonicalTopic,
    description: "Вопросы с этой меткой темы в базе",
    icon: "default",
  };
}
