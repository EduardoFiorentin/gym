# Gym Tracker

Aplicação web para registrar treinos de musculação durante a execução. O projeto reúne uma SPA React, uma API Spring Boot e PostgreSQL em um único sistema.

## O que está disponível

- Autenticação por login, logout, consulta da sessão e cadastro de usuário.
- Criação e consulta de fichas de treino com exercícios.
- Início e retomada de um único treino ativo por usuário.
- Registro, edição e exclusão de séries com carga e repetições.
- Finalização do treino e consulta do histórico, inclusive tela de detalhes.
- Consulta do desempenho da execução finalizada anterior para o exercício selecionado.
- Isolamento dos dados por usuário e bloqueio de alterações em treinos finalizados.

## Arquitetura e tecnologias

| Camada | Tecnologias |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, Chakra UI, TanStack Query, Axios e React Router |
| Backend | Java 21, Spring Boot 3.5, Spring Security, Spring Data JPA, Bean Validation e JWT |
| Persistência | PostgreSQL 15 |
| Infraestrutura | Docker, Docker Compose, Nginx e GitHub Actions |

Em produção, o Nginx entrega a SPA e encaminha chamadas de `/api` ao backend pela rede interna do Docker. PostgreSQL e backend não expõem portas ao host nesse compose.

## Estrutura

```text
.
├── backend/                   # API Spring Boot e testes
│   └── sql/database/           # schema e dados de demonstração para desenvolvimento
├── frontend/                  # SPA React/Vite
├── docs/                      # documentação complementar
├── scripts/                   # publicação de imagens e deploy de produção
├── docker-compose.dev.yml
├── docker-compose.prod.yml
└── .github/workflows/ci.yml
```

## Requisitos

- Docker Engine com Docker Compose v2 para a execução em contêineres;
- Java 21 para executar o backend fora do Docker;
- Node.js 24 e npm para executar o frontend fora do Docker;
- Docker com sessão autenticada no registry, apenas para publicar imagens.

## Configuração de ambiente

Os arquivos `.env.dev` e `.env.prod` contêm dados locais e não devem ser versionados. Crie-os a partir dos exemplos:

```bash
cp .env.dev.example .env.dev
cp .env.prod.example .env.prod
```

Os exemplos possuem valores seguros somente para desenvolvimento. Em produção, defina valores fortes e exclusivos para `POSTGRES_PASSWORD` e `API_SECURITY_TOKEN_SECRET`, além de ajustar domínio, CORS e política de cookies. Consulte [a documentação de cookies e CSRF](docs/security-cookie-csrf.md).

| Variável | Finalidade |
| --- | --- |
| `IMAGE_TAG` | Tag comum das imagens backend e frontend usadas em produção. |
| `BACKEND_IMAGE_REPOSITORY` / `FRONTEND_IMAGE_REPOSITORY` | Repositórios das imagens Docker. |
| `POSTGRES_*` | Banco, usuário e senha do PostgreSQL. |
| `SPRING_DATASOURCE_*` | Conexão usada pelo backend. |
| `API_SECURITY_TOKEN_SECRET` | Segredo de assinatura dos JWTs. |
| `CORS_ALLOWED_ORIGINS` | Origens permitidas, separadas por vírgula. |
| `AUTH_COOKIE_*` / `CSRF_COOKIE_*` | Nome, validade e atributos dos cookies de autenticação e CSRF. |
| `VITE_API_URL` | URL da API incorporada no build do frontend. Em produção, use `/api`. |

> `frontend/.env` contém uma variável com prefixo `REACT_APP_`, que não é lida pelo Vite. A configuração efetiva da aplicação é `VITE_API_URL`, fornecida pelo Compose no desenvolvimento e como argumento de build ao publicar a imagem de produção.

## Executar com Docker

### Desenvolvimento

O ambiente de desenvolvimento sobe banco, API e Vite com sincronização dos fontes.

```bash
docker compose --env-file .env.dev -f docker-compose.dev.yml up --build --watch
```

Endereços padrão:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`
- PostgreSQL: `localhost:5432`

Na criação do volume, o PostgreSQL aplica o schema `backend/sql/database/db_0.0.1.sql` e os dados de demonstração de `backend/sql/database/mock/db_0.0.1.sql`. Para recriar o banco local do zero:

```bash
docker compose --env-file .env.dev -f docker-compose.dev.yml down -v
docker compose --env-file .env.dev -f docker-compose.dev.yml up --build --watch
```

O primeiro comando remove o volume de dados do ambiente de desenvolvimento.

### Produção local

O compose de produção **não constrói imagens**: ele consome imagens já publicadas no registry. Depois de preencher `.env.prod` com uma tag existente:

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml pull
docker compose --env-file .env.prod -f docker-compose.prod.yml up -d --no-build --remove-orphans
```

A aplicação fica disponível em `http://localhost` por padrão. Para aguardar os serviços e conferir o estado, use:

```bash
scripts/deploy-prod.sh "$IMAGE_TAG"
```

O script espera até 120 segundos e mostra o estado final dos contêineres. Detalhes sobre publicação, servidor e CI/CD estão em [docs/deploy-production.md](docs/deploy-production.md).

No primeiro deploy, inicialize o banco com o schema vazio ou restaure um dump completo antes de subir a aplicação. Veja [a seção de inicialização do banco](docs/deploy-production.md#inicialização-do-banco-no-primeiro-deploy).

## Desenvolvimento sem Compose

O caminho recomendado é Docker Compose. Para executar localmente sem ele, disponibilize PostgreSQL com o schema de `backend/sql/database/db_0.0.1.sql` e configure as variáveis de ambiente equivalentes às de `.env.dev`.

```bash
# terminal 1
cd backend
./mvnw spring-boot:run

# terminal 2
cd frontend
npm ci
VITE_API_URL=http://localhost:8080 npm run dev
```

## Testes e validações

Os testes do backend usam Testcontainers com PostgreSQL; Docker deve estar disponível.

```bash
cd backend
./mvnw clean verify

cd ../frontend
npm ci
npm run lint
npm run build
```

O workflow `.github/workflows/ci.yml` executa essas validações em pull requests e pushes para `main`, além de validar os builds Docker.

## Publicar imagens

Os scripts locais exigem uma tag no formato `vX.Y.Z` e uma sessão autenticada no registry Docker:

```bash
scripts/publish-backend-image.sh v1.0.1
scripts/publish-frontend-image.sh v1.0.1
```

Eles usam os repositórios definidos em `.env.prod` — ou em outro arquivo indicado por `ENV_FILE` — e o frontend é gerado com `VITE_API_URL=/api` por padrão.

## Segurança e banco de dados

O JWT é mantido em cookie `HttpOnly`; o browser não o expõe a JavaScript. Requisições mutáveis obtêm e enviam um token CSRF separado. Consulte [docs/security-cookie-csrf.md](docs/security-cookie-csrf.md) para a configuração e os requisitos por ambiente.

O projeto usa scripts SQL versionados em `backend/sql/database` e Hibernate com `spring.jpa.hibernate.ddl-auto=validate`. Portanto, o schema deve existir antes da API iniciar.

- `db_0.0.1.sql`: schema estrutural utilizado por desenvolvimento, produção e testes;
- `mock/db_0.0.1.sql`: dados de demonstração exclusivos do Compose de desenvolvimento;
- `BasicDataLoader`: cria as roles estruturais de forma idempotente;
- `DemoDataLoader`: cria usuários de demonstração apenas nos perfis `dev` e `test`.
