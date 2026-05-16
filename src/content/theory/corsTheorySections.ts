import type { TheorySection } from "@/content/theory/theorySectionTypes";

export const corsTheoryIntro = `
# CORS

**CORS** (Cross-Origin Resource Sharing) — правила, по которым **браузер** решает: можно ли JavaScript на одной странице **прочитать ответ** с другого адреса (другой домен, порт или протокол).

Важно: CORS — это не «защита сервера». Сервер по-прежнему получает запрос. CORS ограничивает только то, что **скрипт на странице увидит в ответе**.
`.trim();

export const corsTheorySections: TheorySection[] = [
  {
    title: "Что такое origin (источник)",
    body: `
**Origin** — это тройка:

- **протокол** (\`http\` / \`https\`)
- **домен** (\`example.com\`)
- **порт** (\`3000\`, \`443\` и т.д.; для 80 и 443 порт часто не пишут в URL, но он всё равно участвует в сравнении)

Два URL — **один origin**, только если совпадают все три части.

| URL A | URL B | Один origin? |
|-------|-------|--------------|
| \`https://app.com\` | \`https://app.com/api\` | да (путь не важен) |
| \`http://app.com\` | \`https://app.com\` | нет (разный протокол) |
| \`https://app.com\` | \`https://api.app.com\` | нет (разный домен) |
| \`http://localhost:3000\` | \`http://localhost:8080\` | нет (разный порт) |

Типичная ситуация на разработке: фронт на \`http://localhost:3000\`, API на \`http://localhost:8080\` — для браузера это **разные источники**, даже на одной машине.
`.trim(),
  },
  {
    title: "Same-Origin Policy — зачем вообще ограничения",
    body: `
По умолчанию действует **политика одного источника** (Same-Origin Policy): скрипт со страницы \`https://bank.com\` не должен молча читать данные с \`https://mail.com\`, даже если у пользователя есть куки на обоих сайтах.

**Зачем:** вы зашли в банк, потом открыли чужой сайт. Без ограничений вредоносный JS на чужом сайте мог бы отправить запрос в банк **с вашими куками** и прочитать ответ (баланс, переводы).

Браузер блокирует **доступ скрипта к ответу**, если origin страницы и origin API не совпадают.

**CORS** — исключение из этого правила: сервер **явно говорит** браузеру, каким чужим origin можно отдать ответ скрипту.
`.trim(),
  },
  {
    title: "Что делает CORS на практике",
    body: `
1. Страница на \`https://my-app.com\` вызывает \`fetch('https://api.other.com/data')\`.
2. Запрос **уходит** на сервер (сервер его обрабатывает).
3. Сервер отвечает и может добавить заголовок, например:  
   \`Access-Control-Allow-Origin: https://my-app.com\`
4. Браузер сравнивает origin страницы с этим заголовком:
   - совпало → скрипт **видит** тело ответа;
   - не совпало или заголовка нет → в консоли **CORS error**, в коде \`fetch\` падает, хотя во вкладке Network ответ может быть виден.

**Главный заголовок ответа:** \`Access-Control-Allow-Origin\`.

- \`https://my-app.com\` — разрешён только этот фронт (нормальный вариант).
- \`*\` — «любой сайт может читать ответ»; **нельзя** вместе с куками (см. раздел про credentials).

Ошибку **нельзя починить** только на фронте (отключить CORS в браузере, «обойти» в \`fetch\`) — нужны правильные заголовки **на сервере** (или прокси на том же origin, что и фронт).
`.trim(),
  },
  {
    title: "Простой запрос и preflight (OPTIONS)",
    body: `
Браузер делит кросс-доменные запросы на два типа.

### Простой запрос (simple)

Отправляется **сразу**, без предварительного OPTIONS. Условия (упрощённо):

- метод: \`GET\`, \`HEAD\` или \`POST\`;
- только «простые» заголовки (\`Accept\`, \`Accept-Language\`, \`Content-Language\` и несколько других);
- для \`POST\`: \`Content-Type\` только \`text/plain\`, \`application/x-www-form-urlencoded\` или \`multipart/form-data\`.

### Сложный запрос → preflight

Если запрос «нестандартный», браузер **сначала** шлёт **OPTIONS** (preflight): «можно ли потом отправить GET/POST/PUT с такими заголовками?».

Типичные причины preflight:

- \`Content-Type: application/json\`;
- методы \`PUT\`, \`PATCH\`, \`DELETE\`;
- кастомные заголовки (\`Authorization\`, \`X-Request-Id\`);
- \`credentials: 'include'\` (куки).

Сервер на OPTIONS должен ответить примерно так:

\`\`\`http
Access-Control-Allow-Origin: https://my-app.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
\`\`\`

Если preflight не прошёл, основной запрос браузер **не отправит** (или отправит, но ответ скрипту не отдаст — зависит от ситуации; в Network часто видны **два** запроса: OPTIONS и основной).

![CORS preflight: четыре шага — OPTIONS, ответ сервера, основной запрос, ответ на запрос](/theory/cors-preflight-flow.png)

![Диаграмма последовательности preflight: OPTIONS → 200 OK → PUT → 200 OK](/theory/cors-preflight-sequence.png)
`.trim(),
  },
  {
    title: "Заголовки CORS — шпаргалка",
    body: `
| Заголовок | Кто шлёт | Зачем |
|-----------|----------|--------|
| \`Origin\` | браузер в запросе | с какой страницы идёт вызов |
| \`Access-Control-Allow-Origin\` | сервер в ответе | какому origin можно читать ответ |
| \`Access-Control-Allow-Methods\` | сервер (часто на OPTIONS) | разрешённые методы |
| \`Access-Control-Allow-Headers\` | сервер (часто на OPTIONS) | разрешённые заголовки запроса |
| \`Access-Control-Allow-Credentials\` | сервер | можно ли слать куки / авторизацию |
| \`Access-Control-Max-Age\` | сервер | как долго кэшировать ответ preflight |

**Минимум для API с JSON:**

1. Обработать **OPTIONS** на нужных путях.
2. На ответах (и на OPTIONS) выставить \`Access-Control-Allow-Origin\` на ваш фронт (не \`*\`, если нужны куки).
3. При \`application/json\` и \`Authorization\` — указать их в \`Access-Control-Allow-Headers\`.
`.trim(),
  },
  {
    title: "Куки и Access-Control-Allow-Credentials",
    body: `
Чтобы браузер **отправил куки** на другой домен, на фронте:

\`\`\`javascript
fetch('https://api.example.com/me', { credentials: 'include' });
\`\`\`

На сервере в ответе:

\`\`\`http
Access-Control-Allow-Origin: https://my-app.com
Access-Control-Allow-Credentials: true
\`\`\`

**Ограничения:**

1. При \`Allow-Credentials: true\` **нельзя** \`Access-Control-Allow-Origin: *\` — только конкретный origin (часто берут из заголовка \`Origin\`, если он в белом списке).
2. В \`Allow-Methods\` и \`Allow-Headers\` тоже нельзя \`*\` — только явный список.

Под «учётными данными» понимают: куки, HTTP Basic/Digest, клиентские TLS-сертификаты.
`.trim(),
  },
  {
    title: "Как настроить на сервере (Node.js + Express)",
    body: `
Пакет \`cors\` для Express:

\`\`\`bash
npm install cors
\`\`\`

**Только для разработки** (любой сайт может читать ответ):

\`\`\`javascript
const cors = require('cors');
app.use(cors()); // Access-Control-Allow-Origin: *
\`\`\`

**Для продакшена** — явный origin фронта:

\`\`\`javascript
const cors = require('cors');

app.use(
  cors({
    origin: 'https://my-app.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);
\`\`\`

Для Nginx, Apache, PHP, Python и др. — примеры на [enable-cors.org](https://enable-cors.org/server.html).

**Прокси на том же origin:** если фронт и API за одним доменом (например, Next.js \`rewrites\` на \`/api\`), браузер не считает запрос кросс-доменным — CORS не нужен для этого маршрута.
`.trim(),
  },
  {
    title: "Типичные ошибки в консоли",
    body: `
**«No 'Access-Control-Allow-Origin' header»**  
Сервер не вернул \`Access-Control-Allow-Origin\` (или origin не совпал). Править **бэкенд** или прокси.

**Preflight не проходит (OPTIONS 404 или без CORS-заголовков)**  
Нет обработчика OPTIONS или на OPTIONS не те же CORS-заголовки, что на GET/POST.

**«Credential is not supported if Allow-Origin is *»**  
Включены куки (\`credentials: 'include'\`), а сервер ответил \`Allow-Origin: *\`. Нужен конкретный origin + \`Allow-Credentials: true\`.

**Запрос виден в Network с кодом 200, но fetch падает**  
Это нормально для CORS: сервер ответил, браузер **запретил скрипту** прочитать тело.

**Путают CORS и 401/403**  
401 — сервер отклонил авторизацию; ответ скрипт мог бы прочитать, если бы CORS был настроен. CORS — отдельная проверка **после** получения ответа.
`.trim(),
  },
  {
    title: "Полезные ссылки",
    body: `
- [CORS — MDN (рус.)](https://developer.mozilla.org/ru/docs/Web/HTTP/Guides/CORS)
- [Same-origin policy — MDN](https://developer.mozilla.org/ru/docs/Web/Security/Defenses/Same-origin_policy)
- [Спецификация Fetch (CORS)](https://fetch.spec.whatwg.org/#http-cors-protocol)
- [middleware cors для Express](https://expressjs.com/en/resources/middleware/cors.html)
- [Настройка CORS на разных серверах](https://enable-cors.org/server.html)
`.trim(),
  },
];
