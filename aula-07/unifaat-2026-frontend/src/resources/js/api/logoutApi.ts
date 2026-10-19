import clientApi from "./_clientApi";

/**
 * Encerra a sessão no servidor (POST /api/logout).
 * O backend apaga o cookie HttpOnly auth_token, que o JavaScript não alcança.
 */
export async function logoutApi(): Promise<void> {
  await clientApi.post("/api/logout");
}
