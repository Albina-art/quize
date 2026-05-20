import type { TheorySection } from "@/content/theory/theorySectionTypes";

export const react19TheoryIntro = `
# Нововведения React 19

**React 19** расширяет модель работы с формами, асинхронными переходами и ресурсами в рендере: появляются **Actions**, хук **\`use\`**, упрощение **\`ref\`**, встроенные **метатеги**, развитие **Suspense** и **Server Components**. Ниже — сжатый обзор с примерами; детали API лучше сверять с [документацией React](https://react.dev).
`.trim();

export const react19TheorySections: TheorySection[] = [
  {
    title: "Actions: формы и асинхронные действия",
    body: `
React 19 вводит **Actions** — единый способ описывать асинхронные обновления, в том числе из форм. Для этого добавлены хуки ниже.

### \`useActionState\` (раньше — \`useFormState\`)

Управляет состоянием **после** выполнения действия (отправка формы, серверный или клиентский обработчик): виден результат, ошибки и флаг **\`pending\`**.

\`\`\`jsx
function SignupForm() {
  const [state, submitAction, isPending] = useActionState(
    async (prevState, formData) => {
      const res = await signup(formData);
      if (!res.ok) return { error: "Ошибка регистрации" };
      return { success: true };
    },
    { error: null },
  );

  return (
    <form action={submitAction}>
      <input name="email" />
      <button type="submit" disabled={isPending}>
        Зарегистрироваться
      </button>
      {state.error && <p>{state.error}</p>}
    </form>
  );
}
\`\`\`

Функция-обработчик получает **предыдущее состояние** и **\`FormData\`** (при отправке через \`action\`). Возвращается массив \`[state, dispatch, isPending]\`. Третий аргумент у \`useActionState\` — опциональная строка **permalink** для согласованности действия при прогрессивном улучшении с серверными действиями (см. документацию).

### \`useFormStatus\`

Даёт статус **ближайшей родительской \`<form>\`** без прокидывания props: удобно для кнопки отправки в дочернем компоненте.

\`\`\`jsx
function SubmitButton() {
  const { pending, data, method, action } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Отправка..." : "Отправить"}
    </button>
  );
}
\`\`\`

Хук **без аргументов**; компонент должен рендериться **внутри** той же формы.

### \`useOptimistic\`

**Оптимистичное обновление UI**: показываем результат до завершения запроса, при ошибке React откатывает отображение.

\`\`\`jsx
function Comments({ comments }) {
  const [optimisticComments, addOptimistic] = useOptimistic(
    comments,
    (state, newComment) => [...state, { ...newComment, isOptimistic: true }],
  );

  const submit = async (formData) => {
    const newComment = { text: formData.get("text") };
    addOptimistic(newComment);
    await postComment(newComment);
  };

  return (
    <form action={submit}>
      <input name="text" />
      <button type="submit">Добавить</button>
      {optimisticComments.map(/* ... */)}
    </form>
  );
}
\`\`\`

Возвращает \`[optimisticState, addOptimistic]\`. Подходит для лайков, чатов, списков с быстрой обратной связью.
`.trim(),
  },
  {
    title: "Хук \`use\`: промисы и контекст",
    body: `
**\`use\`** — API для **синхронного** чтения **промиса** или **контекста** во время рендера. В отличие от остальных хуков, \`use\` можно вызывать **в условиях и циклах** (см. правила в документации: «должен вызываться во время рендера компонента»).

При переданном **промисе** рендер **приостанавливается** до разрешения — нужен родительский **\`Suspense\`** с fallback. При переданном **контексте** поведение близко к \`useContext\` (короткий синтаксис \`use(ThemeContext)\`).

\`\`\`jsx
import { use, Suspense } from "react";

function User({ userId }) {
  const user = use(fetchUser(userId));
  const theme = use(ThemeContext);
  return <div style={{ color: theme }}>{user.name}</div>;
}
\`\`\`

Это **не** замена \`useEffect\` или \`useState\`: не для подписок и локального состояния, а для доступа к уже запущенному асинхронному ресурсу или контексту внутри дерева.
`.trim(),
  },
  {
    title: "Suspense, метаданные, \`ref\`",
    body: `
### Suspense

- Тесная связка с \`use\` и приостановкой по промисам.
- Вложенные границы \`Suspense\` и разные fallback на уровнях.
- В связке с **React Server Components** границы Suspense используют при потоковой отдаче UI с сервера (зависит от фреймворка — Next.js и др.).

Отдельные экспериментальные детали (например, варианты fallback только «на первую загрузку») могут меняться — ориентируйтесь на актуальные release notes.

### \`ref\` без \`forwardRef\`

В функциональных компонентах **\`ref\` можно принимать как обычный prop** — обёртка \`forwardRef\` часто не нужна.

\`\`\`jsx
// Раньше
const MyInput = forwardRef((props, ref) => <input ref={ref} {...props} />);

// React 19
function MyInput({ ref, ...props }) {
  return <input ref={ref} {...props} />;
}
\`\`\`

\`useRef\` как хук остаётся; для **ref-колбэков** допускается **функция очистки** — возвращаемая из колбэка функция вызывается при размонтировании или смене узла:

\`\`\`jsx
<div
  ref={(node) => {
    return () => {
      /* очистка */
    };
  }}
/>
\`\`\`

### Метатеги: \`<title>\`, \`<meta>\`, \`<link>\`

Их можно рендерить **в разметке компонента** — React поднимает их в \`<head>\` (в связке с поддерживаемым рендерером, например в Next.js — по правилам App Router).

\`\`\`jsx
function ProductPage({ product }) {
  return (
    <>
      <title>{product.name} – Магазин</title>
      <meta name="description" content={product.description} />
      <article>...</article>
    </>
  );
}
\`\`\`
`.trim(),
  },
  {
    title: "React Compiler, Server Actions и прочие изменения",
    body: `
### React Compiler

Отдельный инструмент **React Compiler** (ранее React Forget) анализирует код и **автоматически мемоизирует** там, где безопасно, снижая потребность в ручных \`useMemo\`, \`useCallback\` и \`React.memo\`. Компилятор **дополняет** React, а не превращает его в «только компилятор», как у Svelte; правила безопасности и ограничения описаны в документации компилятора.

### \`\"use client\"\` и \`\"use server\"\`

**Server Components** и **Server Actions** — модель разделения сервера и клиента. Директива \`\"use server\"\` помечает функции, вызываемые с клиента через механизм действий (например, из форм).

\`\`\`jsx
async function savePost(formData) {
  "use server";
  await db.post.create({ data: Object.fromEntries(formData) });
}
\`\`\`

Конкретный синтаксис и ограничения зависят от сборщика (Next.js, официальные плагины и т.д.).

### Гидратация и ошибки

Сообщения о несоответствиях при гидратации и поведение в пограничных случаях улучшались в линейке React 19 — проще диагностировать проблемы.

### \`useDeferredValue\` и начальное значение

В React 19 у \`useDeferredValue\` есть **второй аргумент** — начальное значение для отложенного состояния (полезно при SSR и первом кадре):

\`\`\`jsx
const deferred = useDeferredValue(value, "Загрузка...");
\`\`\`

---

**Краткий итог:** Actions упрощают формы и асинхронщину; \`use\` унифицирует чтение промисов и контекста в рендере; упрощённый \`ref\` и компилятор уменьшают шаблонный код; метаданные и серверная модель снижают зависимость от обвязок вроде react-helmet там, где это поддерживает стек.
`.trim(),
  },
];
