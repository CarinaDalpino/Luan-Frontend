import tasksListRender from "../render/tasksListRender";
import { taskUpdateApi } from "../api/taskUpdateApi";
import type { TaskListItemElement } from "../types/dom";

/**
 * Edição do NOME da tarefa (Passo 2 do TF).
 *
 * Troca o <span> do nome por um <input>. Ao confirmar (Enter ou blur),
 * chama a API contextual taskUpdateApi(taskId, { name }) e recarrega a lista.
 * Segue o mesmo padrão dos outros handlers: tipa o event, trata erro e
 * re-renderiza com tasksListRender.
 */
export default function taskEditHandler(event: Event): void {
  const liElement = (event.target as HTMLElement).closest("li") as TaskListItemElement | null;
  if (!liElement) return;

  const { userId: idUser, taskId } = liElement;

  const nameElement = liElement.querySelector<HTMLSpanElement>(".task-name");
  if (!nameElement) return;

  // Evita abrir dois inputs se o usuário clicar/der duplo-clique várias vezes.
  if (liElement.querySelector(".task-edit-input")) return;

  const currentName = nameElement.innerText;

  const inputElement = document.createElement("input");
  inputElement.type = "text";
  inputElement.value = currentName;
  inputElement.classList.add("form-control", "form-control-sm", "flex-grow-1", "task-edit-input");

  nameElement.replaceWith(inputElement);
  inputElement.focus();
  inputElement.select();

  let finished = false;

  async function confirmEdit(): Promise<void> {
    if (finished) return;
    finished = true;

    const newName = inputElement.value.trim();

    // Nome vazio ou inalterado: apenas recarrega, sem chamar a API.
    if (!newName || newName === currentName) {
      await tasksListRender(idUser);
      return;
    }

    try {
      // API Contextual: só o taskId vai pro backend; o idUser vem do JWT.
      await taskUpdateApi(taskId, { name: newName });
      await tasksListRender(idUser);
    } catch (error) {
      alert("Erro ao alterar o nome da tarefa");
      console.error(error);
      await tasksListRender(idUser);
    }
  }

  function cancelEdit(): void {
    if (finished) return;
    finished = true;
    tasksListRender(idUser);
  }

  inputElement.addEventListener("keydown", (keyEvent: KeyboardEvent) => {
    if (keyEvent.key === "Enter") {
      confirmEdit();
    } else if (keyEvent.key === "Escape") {
      cancelEdit();
    }
  });

  inputElement.addEventListener("blur", () => {
    confirmEdit();
  });
}
