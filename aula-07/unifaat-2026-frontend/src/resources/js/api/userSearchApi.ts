import clientApi from "./_clientApi";
import type { PaginatedResponse, User, UserSearchFilters } from "../types/api";

/**
 * Busca de usuários em duas etapas no backend (Elasticsearch → WHERE IN no Postgres).
 *
 * Rota: POST /users/search
 * Body: { filters, page, limit }
 *
 * Devolve a lista paginada já no formato padrão PaginatedResponse<User>.
 */
export async function userSearchApi(
  filters: UserSearchFilters,
  page = 1,
  limit = 10,
): Promise<PaginatedResponse<User>> {
  const { data } = await clientApi.post<PaginatedResponse<User>>("/users/search", {
    filters,
    page,
    limit,
  });

  return data;
}
