export type TheoryTopic = {
  slug: string;
  title: string;
  description: string;
  /** Превью на /theory (файл из public/). */
  illustration?: string;
  /** Совпадает с полем `topic` у вопросов MCQ в БД — для ссылки «Тест по теме». */
  mcqTopic?: string;
  /** Совпадает с полем `topic` у вопросов тренажёра — ссылка «Тренировка по теме». */
  trainerTopic?: string;
};

export const theoryTopics: TheoryTopic[] = [
  {
    slug: "url-browser",
    title: "Что происходит, когда вы вбиваете URL в браузере?",
    description:
      "DNS, TCP-рукопожатие, HTTP и HTTPS, разбор URL, работа веб-сервера и отрисовка страницы.",
    illustration: "/theory/url-browser-cover.png",
    mcqTopic: "Браузер: от URL до экрана",
  },
  {
    slug: "https-tls",
    title: "HTTPS, SSL и TLS",
    description:
      "Что такое TLS и SSL, конфиденциальность и целостность, симметричное и асимметричное шифрование, этапы TLS Handshake.",
    illustration: "/theory/https-tls-cover.png",
    mcqTopic: "HTTPS / TCP / TLS",
  },
  {
    slug: "cors",
    title: "CORS",
    description:
      "Same-origin policy, простые и preflight-запросы, заголовки ответа, куки и credentials, типичные ошибки и прокси.",
    illustration: "/theory/cors-cover.png",
    mcqTopic: "CORS",
  },
  {
    slug: "jwt",
    title: "JWT, Bearer и токены доступа",
    description:
      "Структура JWT, access и refresh, отличие Bearer от формата токена, сравнение с сессиями, OAuth и практика безопасности.",
    illustration: "/theory/jwt-cover.png",
  },
  {
    slug: "websocket",
    title: "WebSocket",
    description:
      "Handshake через HTTP Upgrade, фреймы, Ping/Pong, отличия от HTTP, области применения и пример в браузере.",
    illustration: "/theory/websocket-cover.png",
  },
  {
    slug: "unknown-any-never",
    title: "unknown, any и never в TypeScript",
    description:
      "Чем отличаются «разрешить всё», «ещё не знаем тип» и «значений нет»: безопасность, сужение типов и exhaustive switch.",
    illustration: "/theory/ts-unknown-any-never-cover.png",
  },
  {
    slug: "typescript-utility-types",
    title: "Утилитарные типы TypeScript",
    description:
      "Partial, Required, Readonly, Pick, Omit, Record, Exclude, Extract, NonNullable, ReturnType, Parameters — преобразование типов без дублирования.",
    illustration: "/theory/typescript-utility-types-cover.png",
    mcqTopic: "TypeScript: утилитарные типы",
  },
  {
    slug: "react-typescript-types",
    title: "Типы React и TypeScript",
    description:
      "React.FC, PropsWithChildren, ReactNode, события ChangeEvent/MouseEvent, useRef, Dispatch и SetStateAction, CSSProperties, контекст.",
    illustration: "/theory/ts-unknown-any-never-cover.png",
    mcqTopic: "React: типы и TypeScript",
  },
  {
    slug: "react-intro",
    title: "Что такое React?",
    description:
      "Компоненты, JSX, props, state, Virtual DOM, хуки, поток данных, Router и экосистема.",
    illustration: "/theory/react-js-cover.png",
    trainerTopic: "React: основы",
  },
  {
    slug: "react-virtual-dom",
    title: "Virtual DOM в React",
    description:
      "Зачем абстракция над DOM, diffing и reconciliation, ключи в списках, производительность и ограничения.",
    illustration: "/theory/react-js-cover.png",
    trainerTopic: "React: виртуальный DOM",
  },
  {
    slug: "rendering",
    title: "Рендеринг в браузере и React",
    description:
      "Critical Rendering Path (DOM, CSSOM, layout, paint, composite), фазы Fiber — триггер, рендер и коммит, хуки и DOMContentLoaded.",
    illustration: "/theory/rendering-cover.png",
  },
  {
    slug: "javascript-closures",
    title: "Замыкания в JavaScript",
    description:
      "Лексическое окружение, циклы с var и let, setTimeout, IIFE, приватность и память.",
    illustration: "/theory/typescript-utility-types-cover.png",
    mcqTopic: "JavaScript: замыкания",
    trainerTopic: "JavaScript: замыкания",
  },
];

/** Ссылка на страницу теста с уже выбранной темой (или null, если темы нет в базе MCQ). */
export function mcqUrlForTheorySlug(slug: string): string | null {
  const topic = theoryTopics.find((t) => t.slug === slug)?.mcqTopic;
  if (!topic) return null;
  return `/mcq?topic=${encodeURIComponent(topic)}`;
}

/** Ссылка на главную с фильтром темы тренажёра (или null). */
export function trainerUrlForTheorySlug(slug: string): string | null {
  const entry = theoryTopics.find((t) => t.slug === slug);
  if (!entry) return null;
  const topic = entry.trainerTopic ?? entry.mcqTopic;
  if (!topic) return null;
  return `/?topic=${encodeURIComponent(topic)}`;
}

/** Ссылка на конспект по теме из БД (MCQ или тренажёр), если есть в theoryTopics. */
export function theoryUrlForQuestionTopic(topic: string): string | null {
  const hit = theoryTopics.find(
    (t) => t.mcqTopic === topic || t.trainerTopic === topic,
  );
  return hit ? `/theory/${hit.slug}` : null;
}
