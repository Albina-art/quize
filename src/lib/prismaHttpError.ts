import { Prisma } from "@prisma/client";

function looksLikeMissingTable(error: unknown): boolean {
  const msg =
    error instanceof Error ? error.message : typeof error === "string" ? error : "";
  return /\bdoes not exist\b/i.test(msg) && /\btable\b|\brelation\b/i.test(msg);
}

/** Понятное сообщение для клиента при ошибке Prisma при запросе к БД. */
export function prismaClientErrorMessage(
  fallback: string,
  error: unknown,
): string {
  if (looksLikeMissingTable(error)) {
    return "База не содержит нужных таблиц. В каталоге проекта выполните: npx prisma migrate dev";
  }
  if (process.env.NODE_ENV === "development" && error instanceof Error) {
    return `${fallback} (${error.message})`;
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2021") {
      return "База не содержит нужных таблиц. Выполните: npx prisma migrate dev";
    }
    if (error.code === "P1001") {
      return "Не удаётся достучаться до сервера PostgreSQL. Проверьте DATABASE_URL, сеть и что хост принимает подключения (SSL).";
    }
    if (error.code === "P1003") {
      return "Базы с таким именем нет на сервере. Создайте БД или исправьте DATABASE_URL.";
    }
  }
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return "Не удаётся подключиться к базе данных. Проверьте DATABASE_URL и запущен ли PostgreSQL.";
  }
  return fallback;
}
