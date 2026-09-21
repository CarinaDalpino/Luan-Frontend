import type { Task } from "../types/api";
import type { TaskListItemElement } from "../types/dom";

import taskToggleHandler from "../listeners/taskToggleHandler";
import taskDeleteHandler from "../listeners/taskDeleteHandler";
import taskEditHandler from "../listeners/taskEditHandler";

export default function taskRender(task: Task, idUser: number): TaskListItemElement {
  const liElement = document.createElement("li") as TaskListItemElement;
  liElement.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center", "gap-2");
  liElement.taskId = task.id;
  liElement.userId = idUser;

  // Checkbox: marcar como concluída (chama a API contextual via taskToggleHandler).
  const checkboxElement = document.createElement("input");
  checkboxElement.type = "checkbox";
  checkboxElement.classList.add("form-check-input", "flex-shrink-0");
  checkboxElement.checked = task.is_done;
  checkboxElement.addEventListener("change", taskToggleHandler);
  liElement.append(checkboxElement);

  // Nome da tarefa. A classe "task-name" é usada pelo taskEditHandler.
  const nameElement = document.createElement("span");
  nameElement.innerText = task.name;
  nameElement.classList.add("flex-grow-1", "task-name");

  if (task.is_done) {
    nameElement.classList.add("text-decoration-line-through", "text-muted");
  }

  // Duplo-clique no nome também abre a edição (além do botão Editar).
  nameElement.addEventListener("dblclick", taskEditHandler);

  liElement.append(nameElement);

  // Grupo de botões de ação.
  const actionsElement = document.createElement("div");
  actionsElement.classList.add("d-flex", "gap-2", "flex-shrink-0");

  // Botão Editar: abre a edição do nome (Passo 2 do TF).
  const buttonEditElement = document.createElement("button");
  buttonEditElement.type = "button";
  buttonEditElement.classList.add("btn", "btn-outline-secondary", "btn-sm");
  buttonEditElement.innerText = "Editar";
  buttonEditElement.addEventListener("click", taskEditHandler);
  actionsElement.append(buttonEditElement);

  // Botão Excluir: remove a tarefa (Passo 1 do TF).
  const buttonDeleteElement = document.createElement("button");
  buttonDeleteElement.type = "button";
  buttonDeleteElement.classList.add("btn", "btn-danger", "btn-sm");
  buttonDeleteElement.innerText = "Excluir";
  buttonDeleteElement.addEventListener("click", taskDeleteHandler);
  actionsElement.append(buttonDeleteElement);

  liElement.append(actionsElement);

  return liElement;
}
