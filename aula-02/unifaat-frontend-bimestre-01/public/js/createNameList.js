import editNameList from "./editNameList.js";

export default function createNameList(name) {

    const liElement = document.createElement("li");
    liElement.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");

    const nameElement = document.createElement("span");
    nameElement.classList.add("list-name");
    nameElement.append(document.createTextNode(name));
    liElement.append(nameElement);

    const createDeleteButton = () => {
        const buttonDeleteElement = document.createElement("button");
        buttonDeleteElement.classList.add("btn", "btn-danger", "btn-sm");
        buttonDeleteElement.innerText = "Excluir";
        buttonDeleteElement.addEventListener("click", (event) => {
            event.preventDefault();

            event.currentTarget.parentElement.remove();
        });

        return buttonDeleteElement;
    };

    liElement.append(createDeleteButton());
    editNameList(liElement, createDeleteButton);
    return liElement;

}
