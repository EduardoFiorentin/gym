# Gym Tracker

Gym Tracker e um MVP para registrar treinos de musculacao de forma simples durante a execucao real do treino. O foco da versao `v0.1.0` e resolver o fluxo essencial: criar uma ficha, iniciar um treino, registrar series, finalizar e consultar o historico com referencia do ultimo desempenho por exercicio.

O projeto esta organizado como uma aplicacao web com frontend React, backend Spring Boot e PostgreSQL. Nao e uma arquitetura de microservicos.

## Problema Resolvido

Durante um treino, anotacoes em papel ou apps genericos dificultam consultar rapidamente o que foi feito antes e manter o historico consistente. O Gym Tracker centraliza:

- fichas de treino com exercicios;
- execucao de um treino ativo;
- series com magnitude/carga e repeticoes;
- historico de treinos finalizados;
- ultimo desempenho anterior do exercicio selecionado.

## Fluxo Principal do MVP

1. Autenticacao: o usuario entra na aplicacao e a sessao e mantida por cookie `HttpOnly`.
2. Ficha: o usuario cadastra uma ficha de treino com um nome e uma lista de exercicios.
3. Inicio do treino: o usuario inicia uma execucao a partir de uma ficha.
4. Treino ativo: o treino em andamento e recuperado apos refresh enquanto nao for finalizado.
5. Series: o usuario registra, edita e remove series do treino ativo.
6. Ultimo desempenho: ao selecionar um exercicio, a tela mostra as series da ultima execucao finalizada desse exercicio.
7. Finalizacao: o usuario finaliza o treino ativo.
8. Historico: a home lista execucoes finalizadas recentes.
9. Detalhes: o usuario abre um treino historico e ve ficha, exercicios e series registradas.

## Funcionalidades Implementadas

- Login, logout, `/auth/me` e registro de usuario.
- JWT armazenado em cookie `HttpOnly`, com `SameSite`, `Secure` configuravel por ambiente e protecao CSRF para requisicoes mutaveis.
- Rotas internas protegidas no frontend.
- Cadastro e listagem de fichas de treino.
- Cadastro de exercicios junto da ficha.
- Unidade padrao estrutural `kg` para exercicios criados sem unidade explicita.
- Inicio de treinamento a partir de ficha existente.
- Garantia de no maximo um treinamento ativo por usuario.
- Recuperacao deterministica do treinamento ativo.
- Registro, edicao e remocao de series no treino ativo.
- Bloqueio de alteracoes em treinamento finalizado.
- Finalizacao de treinamento com comportamento deterministico para chamadas repetidas.
- Historico de treinamentos finalizados.
- Tela de detalhes do historico com exercicios e series ordenados.
- Consulta de ultimo desempenho anterior por exercicio, considerando apenas treinamentos finalizados do usuario autenticado.
- Isolamento de dados por usuario no backend.
- Estados de loading, vazio e erro nos fluxos principais.
- Ajustes de responsividade para larguras comuns de celular.

## Stack Atual

### Frontend

- React 19
- TypeScript
- Vite
- Chakra UI 3
- TanStack Query
- Axios
- React Router
- ESLint 9 com Flat Config

### Backend

- Java 21
- Spring Boot 3.5.10
- Spring Web
- Spring Security
- Spring Data JPA
- Bean Validation
- JWT com `java-jwt`
- PostgreSQL Driver
- Testcontainers com PostgreSQL para testes

### Infraestrutura

- Docker
- Docker Compose
- PostgreSQL 15 Alpine
- Nginx Alpine para servir o frontend em producao e fazer proxy de `/api` para o backend

MongoDB nao faz parte do MVP `v0.1.0`. Se necessario, pode ser avaliado futuramente para casos especificos, mas o produto atual funciona apenas com PostgreSQL.

## Estrutura

```text
.
├── backend/                 # API Spring Boot
│   ├── src/
│   ├── sql/database/         # scripts SQL estruturais e mocks de dev
│   └── Dockerfile
├── frontend/                # SPA React/Vite
│   ├── src/
│   ├── nginx.conf
│   └── Dockerfile
├── docker-compose.dev.yml
├── docker-compose.prod.yml
├── .env.dev.example
└── .env.prod.example
```

## Variaveis de Ambiente

Os arquivos reais `.env.dev` e `.env.prod` nao devem ser versionados. Use os exemplos como base:

```bash
cp .env.dev.example .env.dev
cp .env.prod.example .env.prod
```

Principais variaveis:

| Variavel | Uso |
| --- | --- |
| `COMPOSE_PROJECT_NAME` | Nome do projeto Docker Compose. |
| `IMAGE_TAG` | Tag das imagens Docker usadas pelo Compose. Padrao inicial: `v1.0.0`. |
| `BACKEND_IMAGE_REPOSITORY` | Repositorio Docker da API. Padrao: `eduardo0987/gym-backend`. |
| `FRONTEND_IMAGE_REPOSITORY` | Repositorio Docker do frontend. Padrao: `eduardo0987/gym-frontend`. |
| `POSTGRES_DB` | Nome do banco PostgreSQL. |
| `POSTGRES_USER` | Usuario do banco. |
| `POSTGRES_PASSWORD` | Senha do banco. Troque em producao. |
| `POSTGRES_PORT` | Porta publicada do PostgreSQL no compose de desenvolvimento. |
| `BACKEND_PORT` | Porta publicada da API no compose de desenvolvimento. |
| `FRONTEND_PORT` | Porta publicada do frontend. |
| `SPRING_DATASOURCE_URL` | JDBC URL usada pelo backend. |
| `SPRING_DATASOURCE_USERNAME` | Usuario usado pelo backend para acessar o banco. |
| `SPRING_DATASOURCE_PASSWORD` | Senha usada pelo backend para acessar o banco. Troque em producao. |
| `SPRING_PROFILES_ACTIVE` | Profile Spring (`dev`, `prod` ou `test`). |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | Validacao/estrategia de schema do Hibernate. O projeto usa `validate`. |
| `SPRING_JPA_SHOW_SQL` | Exibe SQL em log. Recomendado `false` em producao. |
| `API_SECURITY_TOKEN_SECRET` | Segredo de assinatura JWT. Troque em producao. |
| `CORS_ALLOWED_ORIGINS` | Origem permitida para o frontend em chamadas CORS. |
| `AUTH_COOKIE_NAME` | Nome do cookie de autenticacao. |
| `AUTH_COOKIE_SECURE` | Define `Secure` no cookie de autenticacao. Use `true` em HTTPS/producao. |
| `AUTH_COOKIE_SAME_SITE` | Politica `SameSite` do cookie de autenticacao. |
| `AUTH_COOKIE_MAX_AGE_SECONDS` | Duracao do cookie de autenticacao. |
| `CSRF_COOKIE_SECURE` | Define `Secure` no cookie CSRF. Use `true` em HTTPS/producao. |
| `CSRF_COOKIE_SAME_SITE` | Politica `SameSite` do cookie CSRF. |
| `VITE_API_URL` | URL base usada pelo frontend para chamar a API. Em producao local, use `/api`. |

Nao use os valores dos exemplos como secrets de producao.

## Executando do Zero com Docker

Requisitos:

- Docker
- Docker Compose v2

### Desenvolvimento

O compose de desenvolvimento sobe PostgreSQL, backend e frontend com volumes locais e suporte a atualizacao durante o desenvolvimento.

```bash
cp .env.dev.example .env.dev
docker compose --env-file .env.dev -f docker-compose.dev.yml up --build --watch
```

Servicos publicados por padrao:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`
- PostgreSQL: `localhost:5432`

O ambiente de desenvolvimento inicializa o schema estrutural e tambem carrega dados de mock a partir de `backend/sql/database/mock/db_0.0.1.sql`. O profile `dev` tambem permite seed de usuarios de demonstracao para desenvolvimento local.

### Producao Local

O compose de producao constroi imagens otimizadas, publica apenas o frontend/Nginx e mantem backend e banco acessiveis dentro da rede Docker.

Antes de subir, edite `.env.prod` e troque todos os valores sensiveis.

```bash
cp .env.prod.example .env.prod
docker compose --env-file .env.prod -f docker-compose.prod.yml up --build -d
```

Servico publicado por padrao:

- Aplicacao: `http://localhost`

Em producao, o frontend chama a API por `/api`, e o Nginx faz proxy para `app-backend:8080`.

### Publicar Imagens Docker

Os scripts abaixo geram e publicam uma nova tag nos repositorios configurados nos envs. Eles exigem a tag como parametro e nao executam sem ela.

Formato esperado da tag: `vX.Y.Z`, por exemplo `v1.0.0`.

```bash
scripts/publish-backend-image.sh v1.0.0
scripts/publish-frontend-image.sh v1.0.0
```

Por padrao, os repositorios sao:

- Backend: `eduardo0987/gym-backend`
- Frontend: `eduardo0987/gym-frontend`

Para publicar em outro repositorio, ajuste `BACKEND_IMAGE_REPOSITORY` ou `FRONTEND_IMAGE_REPOSITORY` no `.env.prod`, ou execute com `ENV_FILE` apontando para outro arquivo compatível.

### Reiniciar Banco Local do Zero

Os scripts em `docker-entrypoint-initdb.d` rodam apenas quando o volume do PostgreSQL e criado. Para recriar o banco local de desenvolvimento:

```bash
docker compose --env-file .env.dev -f docker-compose.dev.yml down -v
docker compose --env-file .env.dev -f docker-compose.dev.yml up --build --watch
```

Use esse comando com cuidado: ele remove o volume local do PostgreSQL do compose de desenvolvimento.

## Banco, Migrations e Seed Estrutural

A estrategia atual do MVP usa scripts SQL versionados em `backend/sql/database`.

- `backend/sql/database/db_0.0.1.sql`: schema estrutural usado por dev, prod e testes.
- `backend/sql/database/mock/db_0.0.1.sql`: dados de demonstracao carregados apenas no compose de desenvolvimento.
- `backend/sql/database/db_0.0.1.sql` cria a unidade minima obrigatoria `kg` com ID deterministico.
- `BasicDataLoader` cria roles estruturais obrigatorias (`ADMIN`, `USER`, `MANAGER`) de forma idempotente.
- `DemoDataLoader` cria usuarios de demonstracao apenas nos profiles `dev` e `test`.

O Hibernate roda com `ddl-auto=validate`, portanto o schema precisa existir antes da aplicacao iniciar.

## Testes e Validacao

### Backend

Os testes do backend usam Testcontainers com PostgreSQL, sem depender de um PostgreSQL instalado manualmente na maquina.

```bash
cd backend
./mvnw test
```

### Frontend

```bash
cd frontend
npm run lint
npm run build
```

## Desenvolvimento Local sem Compose

O caminho recomendado e Docker Compose. Para rodar fora do Compose, e necessario prover manualmente um PostgreSQL com o schema de `backend/sql/database/db_0.0.1.sql` e configurar as variaveis equivalentes ao `.env.dev`.

Backend:

```bash
cd backend
./mvnw spring-boot:run
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Notas da Release v0.1.0

Esta release esta preparada para o MVP funcional do Gym Tracker. O escopo nao inclui graficos, rotinas/templates reutilizaveis, IA, social, relatorios avancados, MongoDB ou integracoes externas.
