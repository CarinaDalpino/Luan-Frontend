import clientApi from "./_clientApi";
import type { PaginatedResponse, PaginationParams, Task } from "../types/api";

// API Contextual: o idUser vem do JWT no cookie, não da URL (ver Aula 05, seção 5).
export async function tasksListApi(
  { page = 1, limit = 10 }: PaginationParams = {}
): Promise<PaginatedResponse<Task>> {
  const { data } = await clientApi.get<PaginatedResponse<Task>>(`/me/tasks`, {
    params: { page, limit },
  });

  return data;
}
