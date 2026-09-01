import deleteButtonClickHandler from "../listeners/deleteButtonClickHandler.js";
import { userUpdateApi } from "../api/userUpdateApi.js";

export default function userRender(user, onAfterUpdate) {
    const liElement = document.createElement("li");
    liElement.classList.add(
        "list-group-item",
        "d-flex",
        "justify-content-between",
        "align-items-center",
        "gap-3"
    );

    liElement.userId = user.id;

    const infoElement = document.createElement("div");
    infoElement.classList.add("d-flex", "flex-column", "flex-grow-1");

    const nameTextElement = document.createElement("span");
    nameTextElement.innerText = user.name;

    const emailTextElement = document.createElement("small");
    emailTextElement.classList.add("text-muted");
    emailTextElement.innerText = user.email;

    const nameInputElement = document.createElement("input");
    nameInputElement.type = "text";
    nameInputElement.classList.add("form-control", "form-control-sm");
    nameInputElement.value = user.name;
    nameInputElement.style.display = "none";

    const emailInputElement = document.createElement("input");
    emailInputElement.type = "email";
    emailInputElement.classList.add("form-control", "form-control-sm");
    emailInputElement.value = user.email;
    emailInputElement.style.display = "none";

    infoElement.append(
        nameTextElement,
        emailTextElement,
        nameInputElement,
        emailInputElement
    );

    liElement.append(infoElement);

    const actionsContainer = document.createElement("div");
    actionsContainer.classList.add("d-flex", "gap-2");

    const editButtonElement = document.createElement("button");
    editButtonElement.type = "button";
    editButtonElement.classList.add("btn", "btn-warning", "btn-sm");
    editButtonElement.innerText = "Editar";

    const saveButtonElement = document.createElement("button");
    saveButtonElement.type = "button";
    saveButtonElement.classList.add("btn", "btn-success", "btn-sm");
    saveButtonElement.innerText = "Salvar";
    saveButtonElement.style.display = "none";

    const deleteButtonElement = document.createElement("button");
    deleteButtonElement.type = "button";
    deleteButtonElement.classList.add("btn", "btn-danger", "btn-sm");
    deleteButtonElement.innerText = "Excluir";

    deleteButtonElement.addEventListener(
        "click",
        deleteButtonClickHandler
    );

    editButtonElement.addEventListener("click", () => {
        nameTextElement.style.display = "none";
        emailTextElement.style.display = "none";

        nameInputElement.style.display = "block";
        emailInputElement.style.display = "block";

        editButtonElement.style.display = "none";
        saveButtonElement.style.display = "inline-block";
    });

    saveButtonElement.addEventListener("click", async () => {
        const updatedName = nameInputElement.value.trim();
        const updatedEmail = emailInputElement.value.trim();

        if (!updatedName || !updatedEmail) {
            window.alert("Nome e e-mail são obrigatórios.");
            return;
        }

        try {
            await userUpdateApi(user.id, {
                name: updatedName,
                email: updatedEmail,
            });

            nameTextElement.innerText = updatedName;
            emailTextElement.innerText = updatedEmail;

            nameTextElement.style.display = "inline";
            emailTextElement.style.display = "block";

            nameInputElement.style.display = "none";
            emailInputElement.style.display = "none";

            editButtonElement.style.display = "inline-block";
            saveButtonElement.style.display = "none";

            if (typeof onAfterUpdate === "function") {
                onAfterUpdate();
            }
        } catch (error) {
            console.error("Erro ao atualizar usuário:", error);
            window.alert("Não foi possível atualizar o usuário.");
        }
    });

    actionsContainer.append(
        editButtonElement,
        saveButtonElement,
        deleteButtonElement
    );

    liElement.append(actionsContainer);

    return liElement;
}
