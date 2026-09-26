# Frontend — Gym Tracker

SPA responsável pelos fluxos de autenticação, fichas, treino ativo e histórico. Ela usa React 19, TypeScript, Vite, Chakra UI, TanStack Query, Axios e React Router.

## Comandos

```bash
npm ci
npm run dev
npm run lint
npm run build
npm run preview
```

O servidor de desenvolvimento padrão fica em `http://localhost:5173`.

## Configuração da API

A URL base é lida de `VITE_API_URL`; se ela não for definida, a aplicação usa `http://localhost:8080`.

```bash
VITE_API_URL=http://localhost:8080 npm run dev
```

No Docker Compose de desenvolvimento, esse valor é fornecido por `.env.dev`. A imagem de produção é compilada com `VITE_API_URL=/api`, para que o Nginx faça o proxy das chamadas ao backend.

Variáveis com prefixo `REACT_APP_` não são expostas pelo Vite e não configuram esta aplicação.

## Rotas

| Rota | Finalidade |
| --- | --- |
| `/login` | Autenticação. |
| `/` | Treino atual, fichas e histórico. |
| `/training` | Registro e finalização do treino ativo. |
| `/history/:treinamentoId` | Detalhes de um treino finalizado. |

Com exceção de `/login`, as rotas verificam a sessão por meio de `GET /auth/me`.

## Autenticação e CSRF

O Axios usa `withCredentials`, portanto o JWT de autenticação permanece em cookie `HttpOnly`. Antes de `POST`, `PUT`, `PATCH` ou `DELETE`, o cliente garante a existência do cookie `XSRF-TOKEN` por `GET /auth/csrf` e o Axios o envia como header `X-XSRF-TOKEN`.

Veja também [a documentação de segurança](../docs/security-cookie-csrf.md).
