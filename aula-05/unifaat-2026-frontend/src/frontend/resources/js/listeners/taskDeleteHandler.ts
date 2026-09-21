import tasksListRender from "../render/tasksListRender";
import { taskDeleteApi } from "../api/taskDeleteApi";
import type { TaskListItemElement } from "../types/dom";

export default async function taskDeleteHandler(event: Event): Promise<void> {
  const liElement = (event.target as HTMLElement).closest("li") as TaskListItemElement | null;
  if (!liElement) return;

  const { userId: idUser, taskId } = liElement;

  try {
    // API Contextual: só o taskId vai pro backend; o idUser vem do JWT.
    await taskDeleteApi(taskId);
    // idUser continua servindo para saber de quem é a lista renderizada na tela.
    await tasksListRender(idUser);
  } catch (error) {
    alert("Erro ao excluir tarefa");
    console.error(error);
  }
}
