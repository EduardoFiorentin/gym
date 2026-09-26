# Cookies de autenticação e CSRF

O Gym Tracker usa JWT no cookie de autenticação configurado por `AUTH_COOKIE_NAME` (padrão: `gym_auth`). Esse cookie é emitido pelo backend com `HttpOnly=true` e `Path=/`; por isso o frontend não lê nem armazena o JWT em `localStorage` ou `sessionStorage`.

Como o navegador anexa cookies automaticamente, o backend exige CSRF para chamadas mutáveis. A implementação segue o padrão double-submit:

1. O frontend chama `GET /auth/csrf` quando ainda não há token CSRF.
2. O backend emite o cookie não sensível `XSRF-TOKEN`, acessível ao JavaScript.
3. O Axios envia seu valor no header `X-XSRF-TOKEN` nas chamadas mutáveis.
4. O JWT continua inacessível ao JavaScript.

`POST /auth/login`, `POST /auth/register` e `POST /auth/logout` também participam dessa proteção. O cliente já obtém o token antes dessas chamadas.

## Configuração

| Variável | Padrão | Função |
| --- | --- | --- |
| `AUTH_COOKIE_NAME` | `gym_auth` | Nome do cookie JWT. |
| `AUTH_COOKIE_SECURE` | `false` | Envia o cookie JWT somente por HTTPS quando `true`. |
| `AUTH_COOKIE_SAME_SITE` | `Lax` | Política SameSite do cookie JWT (`Strict`, `Lax` ou `None`). |
| `AUTH_COOKIE_MAX_AGE_SECONDS` | `7200` | Validade do JWT no cookie. |
| `CSRF_COOKIE_SECURE` | valor de `AUTH_COOKIE_SECURE` | Atributo Secure do cookie CSRF. |
| `CSRF_COOKIE_SAME_SITE` | valor de `AUTH_COOKIE_SAME_SITE` | Política SameSite do cookie CSRF. |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173` | Lista de origens permitidas, separadas por vírgula. |

O backend valida a configuração na inicialização: `SameSite=None` exige `Secure=true` tanto para o cookie de autenticação quanto para o cookie CSRF.

## Ambientes

Desenvolvimento local por HTTP:

```dotenv
AUTH_COOKIE_SECURE=false
AUTH_COOKIE_SAME_SITE=Lax
CSRF_COOKIE_SECURE=false
CSRF_COOKIE_SAME_SITE=Lax
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

Produção por HTTPS:

```dotenv
AUTH_COOKIE_SECURE=true
AUTH_COOKIE_SAME_SITE=Lax
CSRF_COOKIE_SECURE=true
CSRF_COOKIE_SAME_SITE=Lax
CORS_ALLOWED_ORIGINS=https://seu-dominio.com
```

Quando frontend e API são servidos pelo mesmo domínio em produção, o frontend usa `/api` e o Nginx encaminha as chamadas ao backend. Ainda assim, mantenha a origem real em `CORS_ALLOWED_ORIGINS` para não abrir a política de CORS desnecessariamente.
