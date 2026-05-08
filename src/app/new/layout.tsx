import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Новая карточка — Quiz",
  description: "Добавление вопроса, подсказки и ответа в базу",
};

export default function NewCardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
