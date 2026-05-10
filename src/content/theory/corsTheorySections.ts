import type { TheorySection } from "@/content/theory/theorySectionTypes";

export const corsTheoryIntro = `
# CORS

На основе видео Михаила Федотова и предоставленных официальных источников я дополнил и расширил предыдущий конспект по CORS. Он охватывает не только суть механизма и частые ошибки, но и позволяет сразу перейти к практической настройке на сервере.

---
`.trim();

export const corsTheorySections: TheorySection[] = [
  {
    title: "🛡️ 1. Что такое CORS и зачем он нужен?",
    body: `
CORS (Cross-Origin Resource Sharing) — это механизм безопасности, встроенный в браузеры. Он позволяет серверу указать, какие сторонние источники (домены, схемы, порты) имеют право читать данные с его ресурсов через JavaScript-запросы (например, \`fetch\` или \`XMLHttpRequest\`).

**История с Алисой, Бобом и Мэллори** отлично объясняет его необходимость:

1. **Алиса** заходит на сайт **Боба** (например, онлайн-банк) с конфиденциальными данными.
2. Пока она там, она открывает сайт злоумышленницы **Мэллори**.
3. Сайт Мэллори содержит вредоносный JS-код, который пытается отправить запрос на сайт Боба, используя куки и сессию Алисы.
4. **Без CORS**: Браузер, следуя политике одного источника (Same-Origin Policy), **заблокировал** бы чтение ответа от Боба, и данные Алисы остались бы в безопасности.
5. **CORS нужен, чтобы «белым» списком** разрешить доступ к данным, которые не являются приватными, или для доверенных сайтов.

**Почему же ошибка возникает у вас?**

Потому что ваше приложение и сервер, к которому оно обращается, — это, с точки зрения браузера, **разные источники**. Основные отличия, как и упоминалось в видео: схема (\`http://\` vs \`https://\`), домен (\`example.com\` vs \`www.example.com\` или \`api.example.com\`) и порт (\`localhost:8080\` vs \`localhost:3000\`).
`.trim(),
  },
  {
    title: "🧐 2. Как работает CORS: простые и предварительные запросы (Preflight)",
    body: `
Браузеры используют CORS для двух типов запросов:

- **Простые запросы (Simple Requests)**: Это старые, безопасные запросы, которые не требуют предварительного «согласования». Браузер отправляет их сразу. К ним относятся \`GET\` и \`POST\` с очень ограниченным набором заголовков (\`Content-Type\` может быть \`text/plain\`, \`application/x-www-form-urlencoded\`, \`multipart/form-data\`).
- **Предварительные запросы (Preflight Requests)**: Это запросы типа **OPTIONS**. Браузер отправляет их перед основным запросом, чтобы «спросить» у сервера разрешение. Это происходит, если запрос считается «сложным», например:
  - Используются методы \`PUT\`, \`PATCH\`, \`DELETE\`.
  - Устанавливается «непростой» заголовок, например \`Content-Type: application/json\`, который вы использовали в видео.
  - В запросе используются учётные данные (cookies).

Если сервер не ответит на \`OPTIONS\` правильными заголовками, браузер не отправит основной запрос (или отправит, но заблокирует ответ). Именно с этим связана ошибка, когда вы видели два запроса во вкладке Network.
`.trim(),
  },
  {
    title: "⚙️ 3. Как исправить CORS? (Ответ от сервера 🖥️)",
    body: `
Ошибку CORS **нельзя исправить в клиентском JavaScript**. Решение находится **исключительно на стороне сервера**. Сервер должен вернуть правильные HTTP-заголовки.

Ключевой заголовок — **\`Access-Control-Allow-Origin\`**. Он указывает, какие источники могут читать ответ сервера.

- \`Access-Control-Allow-Origin: *\` — **НЕБЕЗОПАСНОСТЬ**: Разрешить доступ любому сайту в интернете (не рекомендуется для данных, требующих аутентификации).
- \`Access-Control-Allow-Origin: https://my-site.com\` — **ПРАВИЛЬНЫЙ ПОДХОД**: Разрешить доступ только вашему конкретному сайту (например, \`https://my-site.com\`). Для динамической работы можно читать заголовок запроса \`Origin\` и подставлять его в ответ, если он из доверенного списка.

Для сложных запросов (с \`OPTIONS\`) сервер также должен вернуть заголовки:

- \`Access-Control-Allow-Methods: GET, POST, PUT\` — какие методы разрешены.
- \`Access-Control-Allow-Headers: Content-Type\` — какие дополнительные заголовки разрешены (как в вашем примере с \`application/json\`).
`.trim(),
  },
  {
    title: "🔑 4. Заголовок Access-Control-Allow-Credentials",
    body: `
Заголовок **\`Access-Control-Allow-Credentials\`** — это CORS-заголовок **ответа сервера**. Он указывает браузеру, **разрешено ли** отправлять учётные данные (credentials) при кросс-доменном запросе.

### Какие данные считаются «учётными»?

- Cookies
- HTTP-аутентификация (Basic, Digest, etc.)
- Сертификаты клиента (TLS client certificates)

### Как работает?

- **\`Access-Control-Allow-Credentials: true\`** — браузер может отправлять учётные данные и использовать их на целевой стороне.
- Отсутствие этого заголовка или значение \`false\` — браузер **не** отправит учётные данные, даже если запрос (например, \`fetch\` с \`credentials: 'include'\` или \`XMLHttpRequest\` с \`withCredentials = true\`) их запрашивает.

### Важные ограничения

1. Если заголовок равен \`true\`, то **запрещено** использовать \`Access-Control-Allow-Origin: *\`. Нужно явно указывать конкретный origin (или динамически отражать его).
2. Также нельзя использовать \`*\` в \`Access-Control-Allow-Headers\`, \`Access-Control-Allow-Methods\` — должны быть конкретные значения.

### Пример правильного использования

\`\`\`http
Access-Control-Allow-Origin: https://my-site.com
Access-Control-Allow-Credentials: true
\`\`\`

Без этого заголовка вы не сможете передать сессионную куку или авторизационные данные между разными доменами.
`.trim(),
  },
  {
    title: "🛠️ 5. Практическая настройка на сервере",
    body: `
Как и было сказано в видео, настройка зависит от вашего бэкенда.

**Пример для Node.js + ExpressJS с использованием middleware \`cors\` (это самый простой и рекомендуемый способ):**

1. Установите библиотеку:

\`\`\`bash
npm install cors
\`\`\`

2. Используйте её в вашем Express-приложении:

   **Вариант 1: Разрешить все** (просто для тестов или публичных API):

\`\`\`javascript
var express = require('express');
var cors = require('cors');
var app = express();

// Добавляет заголовок Access-Control-Allow-Origin: *
app.use(cors());

// Ваши маршруты (роуты)...
\`\`\`

   **Вариант 2: Разрешить только ваш фронтенд** (правильный и безопасный):

\`\`\`javascript
var express = require('express');
var cors = require('cors');
var app = express();

var corsOptions = {
  origin: 'http://localhost:8080', // <-- Укажите адрес вашего фронтенда
  optionsSuccessStatus: 200 // для поддержки старых браузеров
};

// Применить для всех роутов
app.use(cors(corsOptions));

// или для конкретного роута
app.get('/api/data', cors(corsOptions), (req, res) => {
  res.json({ message: 'Доступ разрешен!' });
});
\`\`\`

Для других языков и фреймворков (PHP, Python, Java, .NET и т.д.) существует отличный сборник инструкций на сайте **[enable-cors.org](https://enable-cors.org/server.html)**.
`.trim(),
  },
  {
    title: "📚 6. Полезные ссылки для углубления",
    body: `
- **Официальная и полная документация:**
  - **MDN Web Docs:** Полное руководство по CORS на русском языке — [https://developer.mozilla.org/ru/docs/Web/HTTP/Guides/CORS](https://developer.mozilla.org/ru/docs/Web/HTTP/Guides/CORS)
  - **Fetch Standard:** Более техническая спецификация от WHATWG — [https://fetch.spec.whatwg.org/#http-cors-protocol](https://fetch.spec.whatwg.org/#http-cors-protocol)
- **Решение проблем:**
  - **Ошибка \`No 'Access-Control-Allow-Origin'\`:** Лучший ответ на StackOverflow по этой теме — [https://stackoverflow.com/questions/35553500/](https://stackoverflow.com/questions/35553500/)
  - **Безопасность:** Статья о политике одного источника (Same-origin policy) — [https://developer.mozilla.org/ru/docs/Web/Security/Defenses/Same-origin_policy](https://developer.mozilla.org/ru/docs/Web/Security/Defenses/Same-origin_policy)
- **Инструменты:**
  - **Express \`cors\` middleware:** Документация и примеры настройки для Node.js/Express — [https://expressjs.com/en/resources/middleware/cors.html](https://expressjs.com/en/resources/middleware/cors.html)
  - **Сборник для всех платформ:** [https://enable-cors.org/server.html](https://enable-cors.org/server.html) — здесь вы найдёте примеры настройки для Apache, Nginx, IIS и многих других технологий.

Если появятся другие вопросы по CORS или понадобится помощь с настройкой на конкретном языке — обращайтесь.
`.trim(),
  },
];
