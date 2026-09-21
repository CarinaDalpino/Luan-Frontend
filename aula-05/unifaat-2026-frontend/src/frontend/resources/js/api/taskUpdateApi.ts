import clientApi from "./_clientApi";
import type { Task } from "../types/api";

// API Contextual: o idUser vem do JWT no cookie, não da URL (ver Aula 05, seção 5).
export async function taskUpdateApi(
  taskId: number,
  updates: Partial<Pick<Task, "name" | "is_done">>
): Promise<Task> {
  const { data } = await clientApi.put<Task>(`/me/tasks/${taskId}`, updates);

  return data;
}
