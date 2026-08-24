export default function editNameList(liElement) {

    const nameElement = liElement.querySelector("span");

    if (!nameElement) {
        return;
    }

    const currentName = nameElement.innerText;

    const inputElement = document.createElement("input");
    inputElement.setAttribute("type", "text");
    inputElement.value = currentName;
    inputElement.classList.add("form-control");

    const buttonAlterElement = document.createElement("button");
    buttonAlterElement.classList.add("btn", "btn-success", "btn-sm");
    buttonAlterElement.innerText = "Alterar";

    liElement.innerHTML = "";

    liElement.append(inputElement);
    liElement.append(buttonAlterElement);

    const confirmEdit = () => {

        const newName = inputElement.value.trim();

        if (newName === "") {
            inputElement.value = currentName;
            return;
        }

        liElement.innerHTML = "";

        const newNameElement = document.createElement("span");
        newNameElement.innerText = newName;

        liElement.append(newNameElement);

        const buttonDeleteElement = document.createElement("button");
        buttonDeleteElement.classList.add("btn", "btn-danger", "btn-sm");
        buttonDeleteElement.innerText = "Excluir";

        buttonDeleteElement.addEventListener("click", (event) => {
            event.preventDefault();
            event.currentTarget.parentElement.remove();
        });

        liElement.append(buttonDeleteElement);
    };

    buttonAlterElement.addEventListener("click", (event) => {
        event.preventDefault();
        confirmEdit();
    });

    inputElement.addEventListener("keypress", (event) => {
        if (event.key !== "Enter") {
            return;
        }

        event.preventDefault();
        confirmEdit();
    });

    inputElement.focus();
}