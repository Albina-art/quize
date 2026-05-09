/** Клиентский fetch для API приложения — куки сессии отправляются автоматически. */
export async function quizFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  return fetch(input, {
    ...init,
    credentials: "include",
  });
}
