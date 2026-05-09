import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Заметки — Quiz",
  description: "Несколько Markdown-заметок со списком и автосохранением в браузере",
};

export default function NotesLayout({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}
