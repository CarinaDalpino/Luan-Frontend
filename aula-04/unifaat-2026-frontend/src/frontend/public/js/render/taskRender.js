import taskToggleHandler from "../listeners/taskToggleHandler.js";
import taskDeleteHandler from "../listeners/taskDeleteHandler.js";

export default function taskRender(task, idUser) {
    const liElement = document.createElement("li");
    liElement.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
    liElement.taskId = task.id;
    liElement.userId = idUser;

    const nameElement = document.createElement("span");
    nameElement.innerText = task.name;
    nameElement.classList.add("flex-grow-1");

    // Checkbox para marcar como concluída (UPDATE)
    const checkboxElement = document.createElement("input");
    checkboxElement.type = "checkbox";
    checkboxElement.classList.add("form-check-input", "me-2");
    checkboxElement.checked = task.is_done;
    checkboxElement.addEventListener("change", taskToggleHandler);

    if (task.is_done) {
        nameElement.classList.add("text-decoration-line-through", "text-muted");
    }

    liElement.prepend(nameElement);
    liElement.prepend(checkboxElement);

    // Botão Excluir (DELETE)
    const buttonDeleteElement = document.createElement("button");
    buttonDeleteElement.classList.add("btn", "btn-danger", "btn-sm");
    buttonDeleteElement.innerText = "Excluir";
    buttonDeleteElement.addEventListener("click", taskDeleteHandler);
    liElement.append(buttonDeleteElement);

    return liElement;
}
