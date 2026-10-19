import type { PaginatedResponse, User } from "../types/api";

/**
 * Renderiza a lista de resultados da busca de usuários dentro do container informado.
 *
 * Cada resultado mostra nome, e-mail, cargo e cidade/UF, com um botão "Escolher".
 * Ao clicar em "Escolher", chama onSelect com o usuário correspondente.
 * Também exibe o total encontrado e a mensagem de "nenhum resultado".
 */
export default function userSearchResultsRender(
  container: HTMLElement,
  result: PaginatedResponse<User>,
  onSelect: (user: User) => void,
): void {
  container.innerHTML = "";

  if (result.data.length === 0) {
    const emptyElement = document.createElement("p");
    emptyElement.classList.add("text-muted", "m-0");
    emptyElement.innerText = "Nenhum usuário encontrado para essa busca.";
    container.append(emptyElement);
    return;
  }

  const totalElement = document.createElement("p");
  totalElement.classList.add("text-muted", "small", "mb-2");
  totalElement.innerText = `${result.total} usuário(s) encontrado(s). Mostrando ${result.data.length}.`;
  container.append(totalElement);

  const listElement = document.createElement("ul");
  listElement.classList.add("list-group");
  container.append(listElement);

  result.data.forEach((user) => {
    const itemElement = document.createElement("li");
    itemElement.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center", "gap-3");

    const infoElement = document.createElement("div");
    infoElement.classList.add("flex-grow-1");

    const nameElement = document.createElement("div");
    nameElement.classList.add("fw-semibold");
    nameElement.innerText = user.name;

    const emailElement = document.createElement("div");
    emailElement.classList.add("small", "text-muted");
    emailElement.innerText = user.email;

    const detailsElement = document.createElement("div");
    detailsElement.classList.add("small", "text-muted");
    detailsElement.innerText = buildDetails(user);

    infoElement.append(nameElement, emailElement, detailsElement);

    const chooseButton = document.createElement("button");
    chooseButton.type = "button";
    chooseButton.classList.add("btn", "btn-sm", "btn-outline-primary");
    chooseButton.innerText = "Escolher";
    chooseButton.addEventListener("click", () => onSelect(user));

    itemElement.append(infoElement, chooseButton);
    listElement.append(itemElement);
  });
}

/** Monta a linha "cargo — cidade/UF" ignorando campos vazios. */
function buildDetails(user: User): string {
  const parts: string[] = [];

  if (user.job_title) {
    parts.push(user.job_title);
  }

  const location = [user.city, user.state].filter((value) => Boolean(value)).join("/");

  if (location) {
    parts.push(location);
  }

  if (parts.length === 0) {
    return "Sem cargo ou localização informados";
  }

  return parts.join(" — ");
}
