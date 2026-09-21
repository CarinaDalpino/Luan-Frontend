import taskRender from "./taskRender";
import { tasksListApi } from "../api/tasksListApi";

const LIMIT = 10;

export default async function tasksListRender(idUser: number, page = 1): Promise<void> {
  const container = document.querySelector("#tasks-container");

  if (!container) return;

  container.innerHTML = "";

  const ulElement = document.createElement("ul");
  ulElement.id = "tasks-list";
  ulElement.classList.add("list-group");

  container.append(ulElement);

  // API Contextual: idUser não vai na URL (vem do JWT). Aqui ele serve só
  // para re-renderizar a lista do usuário logado após cada ação.
  const listApi = await tasksListApi({ page, limit: LIMIT });

  ulElement.innerHTML = "";

  if (listApi.data.length === 0) {
    const emptyElement = document.createElement("li");
    emptyElement.classList.add("list-group-item", "text-center", "text-muted");
    emptyElement.innerText = "Nenhuma tarefa encontrada. Crie uma nova!";
    ulElement.append(emptyElement);
    return;
  }

  listApi.data.forEach((task) => {
    const liElement = taskRender(task, idUser);
    ulElement.append(liElement);
  });

  // Controles de paginação (Passo 3 do TF).
  container.append(paginationRender(idUser, listApi.page, listApi.limit, listApi.total));
}

// Monta a barra "Anterior / Próxima" usando total + limit para saber os limites.
function paginationRender(
  idUser: number,
  page: number,
  limit: number,
  total: number
): HTMLElement {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const nav = document.createElement("div");
  nav.classList.add("d-flex", "justify-content-between", "align-items-center", "mt-3");

  const prevButton = document.createElement("button");
  prevButton.type = "button";
  prevButton.classList.add("btn", "btn-outline-primary", "btn-sm");
  prevButton.innerText = "Anterior";
  prevButton.disabled = page <= 1;
  prevButton.addEventListener("click", () => {
    tasksListRender(idUser, page - 1);
  });

  const info = document.createElement("span");
  info.classList.add("text-muted", "small");
  info.innerText = `Página ${page} de ${totalPages}`;

  const nextButton = document.createElement("button");
  nextButton.type = "button";
  nextButton.classList.add("btn", "btn-outline-primary", "btn-sm");
  nextButton.innerText = "Próxima";
  nextButton.disabled = page >= totalPages;
  nextButton.addEventListener("click", () => {
    tasksListRender(idUser, page + 1);
  });

  nav.append(prevButton, info, nextButton);

  return nav;
}
