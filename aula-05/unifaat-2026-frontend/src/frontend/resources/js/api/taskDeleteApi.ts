import clientApi from "./_clientApi";

// API Contextual: o idUser vem do JWT no cookie, não da URL (ver Aula 05, seção 5).
export async function taskDeleteApi(taskId: number): Promise<void> {
  const { data } = await clientApi.delete(`/me/tasks/${taskId}`);

  return data;
}
