import type { TheorySection } from "@/content/theory/theorySectionTypes";

export const utilityTypesTheoryIntro = `
# Утилитарные типы TypeScript

**Утилитарные типы** (utility types) — это встроенные обобщённые (\`generic\`) типы в стандартной библиотеке TypeScript, которые **преобразуют** существующие типы: делают поля необязательными или только для чтения, выбирают или исключают ключи, строят объекты по множеству ключей и т.д. Они объявлены в \`lib.es5.d.ts\` / более новых \`lib\` и не требуют импорта.

Ниже — обзорная таблица часто используемых утилитарных типов.

| Тип | Описание |
|-----|----------|
| \`Record<K, T>\` | Объект с ключами типа \`K\` и значениями типа \`T\`. |
| \`Required<T>\` | Все свойства \`T\` становятся **обязательными** (снимает \`?\`). |
| \`Partial<T>\` | Все свойства \`T\` становятся **необязательными**. |
| \`Readonly<T>\` | Все свойства \`T\` только для **чтения**. |
| \`Pick<T, K>\` | Подтип \`T\` только с указанными ключами \`K\`. |
| \`Omit<T, K>\` | \`T\` **без** указанных ключей \`K\`. |
| \`Exclude<T, U>\` | Из union \`T\` убирает типы, пересекающиеся с \`U\`. |
| \`Extract<T, U>\` | Из union \`T\` оставляет только типы, совместимые с \`U\`. |
| \`NonNullable<T>\` | Убирает из \`T\` \`null\` и \`undefined\`. |
| \`ReturnType<T>\` | Тип возвращаемого значения функции \`T\`. |
| \`Parameters<T>\` | Тип кортежа параметров функции \`T\`. |
`.trim();

export const utilityTypesTheorySections: TheorySection[] = [
  {
    title: "Объекты: Partial, Required, Readonly, Pick, Omit",
    body: `
**\`Partial<T>\`** — если у типа все поля обязательны, \`Partial\` делает их опциональными. Удобно для функций обновления «по одному полю».

**\`Required<T>\`** — обратная операция: из опциональных полей делает обязательные.

**\`Readonly<T>\`** — на верхнем уровне запрещает присваивание полям (для вложенности вложенные объекты нужно оборачивать отдельно или использовать глубокие аналоги из сторонних библиотек).

**\`Pick<T, K>\`** и **\`Omit<T, K>\`** — работа с множеством ключей: оставить только нужные или выкинуть лишние.

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email?: string;
}

type UserPreview = Pick<User, "id" | "name">;
type UserWithoutEmail = Omit<User, "email">;
type UserPatch = Partial<User>;
type UserStrict = Required<User>;
type FrozenUser = Readonly<User>;
\`\`\`
`.trim(),
  },
  {
    title: "Record: словари и карты полей",
    body: `
**\`Record<Keys, Value>\`** задаёт объект, у которого **все** ключи из \`Keys\` имеют значения типа \`Value\`. Частый случай — \`Record<string, number>\` для произвольных строковых ключей и числовых значений (счётчики, веса).

\`\`\`typescript
type PageViews = Record<string, number>;

const views: PageViews = {
  "/": 120,
  "/about": 45,
};
\`\`\`

Для **фиксированного** набора ключей можно использовать union литералов:

\`\`\`typescript
type Role = "admin" | "user";
type Permissions = Record<Role, boolean>;
\`\`\`
`.trim(),
  },
  {
    title: "Union: Exclude, Extract, NonNullable",
    body: `
**\`Exclude<T, U>\`** и **\`Extract<T, U>\`** работают с **union** типами (не с ключами объекта). \`Exclude\` вычитает часть union; \`Extract\` — пересекает union с другим типом.

**\`NonNullable<T>\`** — сахар: из типа \`T\` убираются \`null\` и \`undefined\`. Для \`string | number | null | undefined\` результат — \`string | number\`. По смыслу это то же, что \`Exclude<T, null | undefined>\`, но имя отражает типичный сценарий.

\`\`\`typescript
type T = string | number | null | undefined;
type A = NonNullable<T>; // string | number
type B = Exclude<T, null | undefined>; // string | number
type C = Extract<T, string | number>; // string | number
\`\`\`
`.trim(),
  },
  {
    title: "Функции: ReturnType и Parameters",
    body: `
**\`ReturnType<T>\`** извлекает тип значения, которое возвращает функция (для перегрузок берётся последняя сигнатура). **\`Parameters<T>\`** — кортеж типов параметров.

\`\`\`typescript
declare function fetchUser(id: number): Promise<{ name: string }>;

type R = ReturnType<typeof fetchUser>; // Promise<{ name: string }>
type P = Parameters<typeof fetchUser>; // [id: number]

type Fn = () => string;
type Ret = ReturnType<Fn>; // string
\`\`\`

Удобно не дублировать типы при обёртках, адаптерах и тестах.
`.trim(),
  },
];
