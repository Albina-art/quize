export type TheoryTopic = {
  slug: string;
  title: string;
  description: string;
  /** Совпадает с полем `topic` у вопросов MCQ в БД — для ссылки «Тест по теме». */
  mcqTopic?: string;
};

export const theoryTopics: TheoryTopic[] = [
  {
    slug: "url-browser",
    title: "Что происходит, когда вы вбиваете URL в браузере?",
    description:
      "DNS, TCP-рукопожатие, HTTP и HTTPS, разбор URL, работа веб-сервера и отрисовка страницы.",
    mcqTopic: "Браузер: от URL до экрана",
  },
  {
    slug: "https-tls",
    title: "HTTPS, SSL и TLS",
    description:
      "Что такое TLS и SSL, конфиденциальность и целостность, симметричное и асимметричное шифрование, этапы TLS Handshake.",
    mcqTopic: "HTTPS / TCP / TLS",
  },
];

/** Ссылка на страницу теста с уже выбранной темой (или null, если темы нет в базе MCQ). */
export function mcqUrlForTheorySlug(slug: string): string | null {
  const topic = theoryTopics.find((t) => t.slug === slug)?.mcqTopic;
  if (!topic) return null;
  return `/mcq?topic=${encodeURIComponent(topic)}`;
}
