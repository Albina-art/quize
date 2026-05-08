export type UrlBrowserOrderStepId =
  | "dns"
  | "tcp"
  | "https"
  | "server"
  | "render";

export type UrlBrowserOrderStep = {
  id: UrlBrowserOrderStepId;
  title: string;
  description: string;
};

/** Порядок как в статье: DNS → TCP → HTTP(S) → сервер → отрисовка. */
export const urlBrowserOrderSteps: UrlBrowserOrderStep[] = [
  {
    id: "dns",
    title: "Найти IP сервера (DNS)",
    description:
      "Домен превращается в IP: кэш браузера и ОС, файл hosts, затем рекурсивный запрос к DNS.",
  },
  {
    id: "tcp",
    title: "Установить TCP-соединение",
    description:
      "К клиенту по IP: тройное рукопожатие SYN → SYN/ACK → ACK; надёжная доставка байтов.",
  },
  {
    id: "https",
    title: "HTTPS и HTTP-запрос",
    description:
      "Поверх TCP — TLS (сертификат, рукопожатие), затем зашифрованный запрос: метод, путь, заголовки.",
  },
  {
    id: "server",
    title: "Сервер обрабатывает запрос",
    description:
      "Веб-сервер и приложение: статика с диска или динамика, БД, формирование ответа.",
  },
  {
    id: "render",
    title: "Ответ браузеру и отрисовка",
    description:
      "HTML, CSS, JS; парсинг DOM/CSSOM, layout, paint — страница на экране.",
  },
];

export const urlBrowserOrderCorrectIds: UrlBrowserOrderStepId[] =
  urlBrowserOrderSteps.map((s) => s.id);

const stepsById = Object.fromEntries(
  urlBrowserOrderSteps.map((s) => [s.id, s]),
) as Record<UrlBrowserOrderStepId, UrlBrowserOrderStep>;

/** Начальный порядок карточек (перемешан, но стабилен для SSR). */
export const urlBrowserOrderInitialIds: UrlBrowserOrderStepId[] = [
  "render",
  "server",
  "dns",
  "https",
  "tcp",
];

export function stepsFromIds(
  ids: UrlBrowserOrderStepId[],
): UrlBrowserOrderStep[] {
  return ids.map((id) => stepsById[id]);
}
