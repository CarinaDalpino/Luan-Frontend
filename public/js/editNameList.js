export default function editNameList(liElement, createDeleteButton) {

    liElement.addEventListener("click", (event) => {
        const nameElement = liElement.querySelector(".list-name");

        if (nameElement === null || event.target !== nameElement) {
            return;
        }

        const inputElement = document.createElement("input");
        inputElement.setAttribute("type", "text");
        inputElement.classList.add("form-control");
        inputElement.value = nameElement.innerText;

        const buttonChangeElement = document.createElement("button");
        buttonChangeElement.setAttribute("type", "button");
        buttonChangeElement.classList.add("btn", "btn-success", "btn-sm");
        buttonChangeElement.innerText = "Alterar";

        nameElement.remove();
        liElement.querySelector("button").remove();
        liElement.append(inputElement, buttonChangeElement);
        inputElement.focus();

        const confirmChange = () => {
            const newName = inputElement.value.trim();

            if (newName === "") {
                return;
            }

            const newNameElement = document.createElement("span");
            newNameElement.classList.add("list-name");
            newNameElement.append(document.createTextNode(newName));

            inputElement.remove();
            buttonChangeElement.remove();
            liElement.prepend(newNameElement);
            liElement.append(createDeleteButton());
        };

        buttonChangeElement.addEventListener("click", (changeEvent) => {
            changeEvent.preventDefault();
            confirmChange();
        });

        inputElement.addEventListener("keydown", (keyEvent) => {
            if (keyEvent.key !== "Enter") {
                return;
            }

            keyEvent.preventDefault();
            confirmChange();
        });
    });

}