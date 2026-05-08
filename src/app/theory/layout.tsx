import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Теория — Quiz",
  description: "Темы по сетям, браузеру и безопасности",
};

export default function TheoryLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return children;
}
