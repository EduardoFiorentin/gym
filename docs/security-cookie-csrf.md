# Postura de seguranca para cookies e CSRF

O Gym Tracker usa autenticacao por JWT armazenado exclusivamente no cookie `gym_auth`.
Esse cookie e emitido pelo backend com `HttpOnly=true`, `Path=/` e `SameSite=Lax`.
O frontend envia cookies com `withCredentials`, mas nao le nem persiste o JWT em
`localStorage` ou `sessionStorage`.

Como o navegador envia cookies automaticamente, a API habilita protecao CSRF do
Spring Security para metodos mutaveis (`POST`, `PUT`, `PATCH`, `DELETE`). A estrategia
usa o padrao double-submit:

- `GET /auth/csrf` emite o cookie `XSRF-TOKEN`;
- o frontend le somente esse token nao sensivel;
- o Axios envia o valor no header `X-XSRF-TOKEN`;
- o JWT permanece inacessivel para JavaScript.

`SameSite=Lax` e a lista explicita de origens CORS reduzem a exposicao entre sites,
mas nao substituem a validacao CSRF. A validacao explicita protege a aplicacao mesmo
se a topologia futura exigir ajuste de origem ou `SameSite=None`.

## Ambientes

Dev local usa HTTP:

- `AUTH_COOKIE_SECURE=false`
- `AUTH_COOKIE_SAME_SITE=Lax`
- `CSRF_COOKIE_SECURE=false`
- `CSRF_COOKIE_SAME_SITE=Lax`
- `CORS_ALLOWED_ORIGINS=http://localhost:5173`

Prod deve usar HTTPS:

- `AUTH_COOKIE_SECURE=true`
- `AUTH_COOKIE_SAME_SITE=Lax`
- `CSRF_COOKIE_SECURE=true`
- `CSRF_COOKIE_SAME_SITE=Lax`
- `CORS_ALLOWED_ORIGINS=https://seu-dominio.com`

Se algum cookie for configurado como `SameSite=None`, `Secure=true` passa a ser
obrigatorio na inicializacao da aplicacao.
