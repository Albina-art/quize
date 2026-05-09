import type { TheorySection } from "@/content/theory/theorySectionTypes";

export const reactTypesTheoryIntro = `
# Основные типы в React (с TypeScript)

В React с TypeScript вы постоянно сталкиваетесь с типами компонентов, хуков, событий DOM и контекста. Ниже — «шпаргалка» по часто используемым именам из пространства имён \`React\`.

| Тип / интерфейс | Назначение |
|-----------------|------------|
| \`React.FC<P>\` / \`React.FunctionComponent<P>\` | Функциональный компонент с пропсами \`P\`. В **React 18** тип \`children\` в \`FC\` **не добавляется автоматически** — при необходимости перечислите \`children\` в \`P\` или используйте \`PropsWithChildren<P>\`. |
| \`React.PropsWithChildren<P>\` | Добавляет к пропсам \`P\` свойство \`children\`. |
| \`React.ReactNode\` | Всё, что можно отрендерить: строки, числа, \`ReactElement\`, \`boolean\`, \`null\`, \`undefined\`, массивы узлов и т.д. |
| \`React.ReactElement\` | Конкретный элемент React (результат \`createElement\` или JSX-выражения). |
| \`React.CSSProperties\` | Объект для inline-\`style\` с автодополнением имён CSS-свойств в camelCase. |
| \`React.ChangeEvent<T>\` | Событие изменения для \`input\`, \`select\`, \`textarea\`; \`T\` — тип элемента (например \`HTMLInputElement\`). |
| \`React.MouseEvent<T>\` | События мыши. |
| \`React.FormEvent<T>\` | События формы (submit и др.). |
| \`React.RefObject<T>\` | Реф с \`current: T | null\` (типично для \`useRef<T>(null)\` при привязке к DOM). |
| \`React.MutableRefObject<T>\` | Реф, у которого \`current\` можно переприсваивать (\`useRef\` со значением не-\`null\` или изменяемое значение). |
| \`React.Dispatch<React.SetStateAction<S>>\` | Тип setter’а из \`useState\` — второй элемент кортежа. |
| \`React.SetStateAction<S>\` | Аргумент setter’а: либо \`S\`, либо \`(prev: S) => S\`. |
| \`React.Context<T>\` | Тип значения, возвращаемого \`createContext<T>(...)\`. |
| \`Provider\` | У объекта контекста есть \`.Provider\`; тип пропсов Provider выводится из типа контекста. |
`.trim();

export const reactTypesTheorySections: TheorySection[] = [
  {
    title: "Компоненты: FC, пропсы и children",
    body: `
**\`React.FC<Props>\`** задаёт сигнатуру функции-компонента. Явно пропишите \`children\` в \`Props\` или оберните тип в **\`PropsWithChildren<ВашиПропсы>\`**, если нужны дочерние элементы.

\`\`\`tsx
type Props = { title: string };

const Header: React.FC<Props> = ({ title }) => <h1>{title}</h1>;

type CardProps = React.PropsWithChildren<{ id: string }>;

const Card: React.FC<CardProps> = ({ id, children }) => (
  <section data-id={id}>{children}</section>
);
\`\`\`

**\`React.ReactNode\`** используйте для пропсов вроде \`label?: React.ReactNode\` или возвращаемого типа, когда допустимы строка, число, несколько элементов или \`null\`.
`.trim(),
  },
  {
    title: "События DOM",
    body: `
Для **\`onChange\`** у контролируемого \`<input>\` обычно берут **\`React.ChangeEvent<HTMLInputElement>\`**. Для **\`onClick\`** — **\`React.MouseEvent<HTMLElement>\`** (или узкий элемент). Для **\`onSubmit\`** формы — **\`React.FormEvent<HTMLFormElement>\`**.

\`\`\`tsx
function Field() {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  return <input onChange={onChange} />;
}
\`\`\`
`.trim(),
  },
  {
    title: "useState и useRef",
    body: `
Если \`const [count, setCount] = useState(0)\`, то тип **\`setCount\`** — **\`React.Dispatch<React.SetStateAction<number>>\`**. Он принимает и новое значение, и функцию \`(prev) => next\`, потому что **\`SetStateAction<number>\`** — это \`number | ((prev: number) => number)\`.

**\`useRef<HTMLDivElement>(null)\`** даёт **\`React.RefObject<HTMLDivElement>\`**: объект с полем \`current\`, которое до монтирования \`null\`, после — экземпляр DOM-узла (или остаётся \`null\`, если условный рендер).

\`\`\`tsx
const ref = useRef<HTMLDivElement>(null);
// ref: RefObject<HTMLDivElement | null> в строгих типах @types/react
\`\`\`

**\`MutableRefObject<T>\`** чаще встречается при \`useRef<T>(начальноеЗначение)\`, где \`T\` не включает \`null\`, или при хранении таймера/флага без привязки к DOM.
`.trim(),
  },
  {
    title: "Стили, элементы и контекст",
    body: `
Для пропа **\`style\`** у JSX-элементов используйте **\`React.CSSProperties\`** — так TypeScript подсказывает допустимые ключи и типы значений (\`number\` для пикселей где принято, строки для сложных значений).

**\`React.ReactElement\`** — это уже **готовый** элемент (один узел с типом и пропсами), а не «любой рендер», в отличие от **\`React.ReactNode\`**.

**\`createContext\`** возвращает объект типа **\`React.Context<T>\`**; у него есть **\`.Provider\`**. Тип пропсов \`Provider\` (\`value\` и т.д.) выводится из \`T\`; при необходимости контекст и \`value\` можно аннотировать явно.
`.trim(),
  },
];
