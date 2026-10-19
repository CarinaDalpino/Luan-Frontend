/**
 * Encerra a sessão do usuário.
 *
 * Rota: POST /api/logout
 *
 * O cookie auth_token é HttpOnly, então o JavaScript do navegador não consegue
 * apagá-lo. Quem remove é o servidor, com clearCookie usando os MESMOS atributos
 * com que o cookie foi criado no login (httpOnly, sameSite), para o navegador
 * reconhecer e expirar o cookie.
 */
export default function LogoutController(request, response) {
    response.clearCookie("auth_token", {
        httpOnly: true,
        sameSite: "lax"
    });

    return response.status(200).json({ ok: true });
}
