import { userSearchApi } from "../api/userSearchApi";
import { taskCreateApi } from "../api/taskCreateApi";
import userSearchResultsRender from "../render/userSearchResultsRender";
import tasksListRender from "../render/tasksListRender";
import type { User, UserSearchFilters, UserSearchTextField } from "../types/api";

/**
 * Liga a interação do modal "Nova tarefa para outro usuário".
 *
 * Fluxo: digita o nome da tarefa → busca a pessoa por um campo (POST /users/search)
 * → escolhe um resultado → cria a tarefa para ela (POST /users/{id}/tasks).
 *
 * @param idUser id do usuário logado (para recarregar a lista quando a tarefa é para si mesmo)
 */
export default function assignTaskModalListeners(idUser: number): void {
  const modalElement = document.querySelector<HTMLDivElement>("#assign-task-modal");
  const taskNameInput = document.querySelector<HTMLInputElement>("#assign-task-name");
  const searchFieldSelect = document.querySelector<HTMLSelectElement>("#assign-search-field");
  const searchValueInput = document.querySelector<HTMLInputElement>("#assign-search-value");
  const searchButton = document.querySelector<HTMLButtonElement>("#assign-search-btn");
  const resultsContainer = document.querySelector<HTMLDivElement>("#assign-search-results");
  const selectedContainer = document.querySelector<HTMLDivElement>("#assign-selected-user");
  const submitButton = document.querySelector<HTMLButtonElement>("#assign-task-submit");

  if (
    !modalElement ||
    !taskNameInput ||
    !searchFieldSelect ||
    !searchValueInput ||
    !searchButton ||
    !resultsContainer ||
    !selectedContainer ||
    !submitButton
  ) {
    return;
  }

  // Usuário escolhido no momento (fica em memória enquanto o modal está aberto)
  let selectedUser: User | null = null;

  // "Criar tarefa" só habilita com nome preenchido E usuário escolhido
  const refreshSubmitState = (): void => {
    const hasName = taskNameInput.value.trim().length > 0;
    submitButton.disabled = !(hasName && selectedUser !== null);
  };

  const showSelectedUser = (user: User): void => {
    selectedUser = user;
    selectedContainer.classList.remove("d-none");
    selectedContainer.innerHTML = "";

    const label = document.createElement("div");
    label.classList.add("alert", "alert-info", "m-0");
    label.innerText = `Atribuir para: ${user.name} (${user.email})`;
    selectedContainer.append(label);

    refreshSubmitState();
  };

  const showResultsMessage = (message: string, variant = "text-muted"): void => {
    resultsContainer.innerHTML = "";
    const paragraph = document.createElement("p");
    paragraph.classList.add(variant, "m-0");
    paragraph.innerText = message;
    resultsContainer.append(paragraph);
  };

  const resetModal = (): void => {
    taskNameInput.value = "";
    searchValueInput.value = "";
    resultsContainer.innerHTML = "";
    selectedContainer.classList.add("d-none");
    selectedContainer.innerHTML = "";
    selectedUser = null;
    refreshSubmitState();
  };

  const runSearch = async (): Promise<void> => {
    const field = searchFieldSelect.value as UserSearchTextField;
    const value = searchValueInput.value.trim();

    if (!value) {
      showResultsMessage("Digite um texto para buscar.");
      return;
    }

    const filters: UserSearchFilters = { [field]: value };

    try {
      showResultsMessage("Buscando...");
      const result = await userSearchApi(filters, 1, 10);
      userSearchResultsRender(resultsContainer, result, showSelectedUser);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      showResultsMessage("Erro ao buscar usuários. Tente novamente.", "text-danger");
    }
  };

  const submitTask = async (): Promise<void> => {
    const taskName = taskNameInput.value.trim();

    if (!taskName || selectedUser === null) {
      return;
    }

    const targetUser = selectedUser;

    try {
      submitButton.disabled = true;
      await taskCreateApi(targetUser.id, { name: taskName });

      // Se a tarefa foi atribuída a si mesmo, a lista precisa refletir isso na hora
      if (targetUser.id === idUser) {
        await tasksListRender(idUser);
      }

      closeModal(modalElement);
      resetModal();
      alert(`Tarefa criada para ${targetUser.name}.`);
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
      showResultsMessage("Erro ao criar a tarefa. Tente novamente.", "text-danger");
      refreshSubmitState();
    }
  };

  searchButton.addEventListener("click", runSearch);

  searchValueInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    void runSearch();
  });

  taskNameInput.addEventListener("input", refreshSubmitState);

  submitButton.addEventListener("click", submitTask);

  // Limpa tudo sempre que o modal fecha, para a próxima abertura começar do zero
  modalElement.addEventListener("hidden.bs.modal", resetModal);
}

/**
 * Fecha o modal usando a instância do Bootstrap já carregada no bundle (app.ts).
 * O bundle expõe o objeto global window.bootstrap em runtime.
 */
function closeModal(modalElement: HTMLElement): void {
  const bootstrap = (window as unknown as {
    bootstrap?: { Modal: { getOrCreateInstance(element: HTMLElement): { hide(): void } } };
  }).bootstrap;

  if (!bootstrap) {
    return;
  }

  bootstrap.Modal.getOrCreateInstance(modalElement).hide();
}
