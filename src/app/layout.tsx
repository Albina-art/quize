import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppChrome from "@/components/AppChrome";
import MuiProvider from "@/components/MuiProvider";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Quiz — тренажёр вопросов",
  description: "Вопросы по темам с подсказками и случайной выдачей",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={inter.variable}>
      <body className={inter.className}>
        <MuiProvider>
          <AppChrome>{children}</AppChrome>
        </MuiProvider>
      </body>
    </html>
  );
}
