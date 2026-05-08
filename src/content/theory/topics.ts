export type TheoryTopic = {
  slug: string;
  title: string;
  description: string;
};

export const theoryTopics: TheoryTopic[] = [
  {
    slug: "url-browser",
    title: "Что происходит, когда вы вбиваете URL в браузере?",
    description:
      "DNS, TCP-рукопожатие, HTTP и HTTPS, разбор URL, работа веб-сервера и отрисовка страницы.",
  },
];
