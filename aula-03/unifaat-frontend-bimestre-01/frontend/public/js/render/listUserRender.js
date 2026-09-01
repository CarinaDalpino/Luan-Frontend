import userRender from "./userRender.js";
import { userListApi } from "../api/userListApi.js";

export default async function listUserRender(currentPage = 1) {
    const sectionListElement = document.querySelector("#list-container");

    sectionListElement.innerHTML = "";

    const listWrapper = document.createElement("div");
    listWrapper.classList.add("d-flex", "flex-column", "gap-3");

    const ulElement = document.createElement("ul");
    ulElement.classList.add("list-group");

    const response = await userListApi({
        page: currentPage,
        limit: 10
    });

    const {
        data: users,
        page,
        total,
        next,
        limit
    } = response;

    users.forEach((user) => {
        const liElement = userRender(user, async () => {
            await listUserRender(page);
        });

        ulElement.append(liElement);
    });

    const paginationElement = document.createElement("div");

    paginationElement.classList.add(
        "d-flex",
        "align-items-center",
        "justify-content-between",
        "gap-2",
        "mt-3"
    );

    const previousButton = document.createElement("button");

    previousButton.type = "button";
    previousButton.classList.add(
        "btn",
        "btn-outline-primary",
        "btn-sm"
    );

    previousButton.innerText = "Anterior";
    previousButton.disabled = page <= 1;

    previousButton.addEventListener("click", async () => {
        if (page > 1) {
            await listUserRender(page - 1);
        }
    });

    const currentPageLabel = document.createElement("span");

    currentPageLabel.classList.add(
        "small",
        "text-muted",
        "fw-bold"
    );

    const totalPages = Math.max(
        1,
        Math.ceil(total / limit)
    );

    currentPageLabel.innerText = `Página ${page} de ${totalPages}`;

    const nextButton = document.createElement("button");

    nextButton.type = "button";
    nextButton.classList.add(
        "btn",
        "btn-outline-primary",
        "btn-sm"
    );

    nextButton.innerText = "Próxima";
    nextButton.disabled = !next;

    nextButton.addEventListener("click", async () => {
        if (next) {
            await listUserRender(next);
        }
    });

    paginationElement.append(
        previousButton,
        currentPageLabel,
        nextButton
    );

    listWrapper.append(
        ulElement,
        paginationElement
    );

    sectionListElement.append(listWrapper);
}