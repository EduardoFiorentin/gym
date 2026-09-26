# Publicação e deploy de produção

O Compose de produção executa imagens prontas do registry. Ele não possui seções `build`; o frontend já chega compilado com `VITE_API_URL=/api` e é servido pelo Nginx.

## Publicação manual

Autentique o Docker no registry e publique ambas as imagens com a mesma tag semântica:

```bash
scripts/publish-backend-image.sh v1.0.1
scripts/publish-frontend-image.sh v1.0.1
```

Os scripts leem `.env.prod` por padrão. Para usar outro arquivo compatível:

```bash
ENV_FILE=/caminho/para/arquivo.env scripts/publish-backend-image.sh v1.0.1
```

## Inicialização do banco no primeiro deploy

Execute a inicialização **antes** de `deploy-prod.sh`. O script sobe somente o PostgreSQL e aguarda seu healthcheck; o deploy da aplicação continua sendo uma etapa separada.

Para criar a base com o schema do projeto e sem dados de aplicação:

```bash
./scripts/initialize-prod-database.sh --begin-empty
./scripts/deploy-prod.sh <image-tag>
```

Para restaurar um dump completo:

```bash
./scripts/initialize-prod-database.sh --file /caminho/para/backup.custom
./scripts/deploy-prod.sh <image-tag>
```

São aceitos dumps SQL (`.sql`), SQL compactado (`.sql.gz`) e archives customizados do `pg_dump` (por exemplo, `.custom` ou `.dump`). O dump deve conter schema e dados da base da aplicação. Para criar um archive portátil, prefira:

```bash
pg_dump --format=custom --no-owner --no-privileges --file backup.custom <nome-do-banco>
```

Se o volume já existir, mas contiver apenas o schema estrutural e nenhum dado da aplicação, o script pode reutilizá-lo sem parâmetro adicional. Se houver dados — ou se essa verificação não puder ser concluída — ele se recusa a substituir o volume `pgdata-prod` sem `--force`. Esse parâmetro remove os contêineres e o volume de dados do Compose de produção antes de iniciar a nova base; use-o somente depois de verificar o backup:

```bash
./scripts/initialize-prod-database.sh --file /caminho/para/backup.custom --force
```

## Deploy manual no servidor

No diretório do repositório no servidor, crie `.env.prod` a partir do exemplo, troque todos os valores sensíveis e informe a tag a implantar:

```bash
cp .env.prod.example .env.prod
# editar .env.prod
./scripts/deploy-prod.sh v1.0.1
```

O script executa `docker compose pull`, sobe os serviços sem build, remove órfãos, espera até 120 segundos e mostra o status final. O banco mantém o volume nomeado `pgdata-prod`; não use `down -v` em produção, a menos que a remoção dos dados seja intencional.

Para consultar logs depois do deploy:

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml logs -f app-backend
```

## Pipeline do GitHub Actions

O workflow em `.github/workflows/ci.yml` é acionado em pull requests e pushes para `main`.

| Evento | Etapas |
| --- | --- |
| Pull request para `main` | Testes do backend, lint/build do frontend e build das imagens sem publicação. |
| Push para `main` | As mesmas validações, publicação das imagens no Docker Hub com as tags `latest` e `sha-<commit-curto>`, seguida do deploy. |

O job de deploy conecta por SSH ao servidor, atualiza o checkout em `/opt/gym` para o commit exato e executa `scripts/deploy-prod.sh` com a tag `sha-<commit-curto>`. Deploys concorrentes são serializados pelo grupo `gym-production`.

## Configuração necessária no GitHub

Configure as variáveis do repositório `DOCKERHUB_USERNAME`, `VPS_HOST`, `VPS_USER` e, se necessário, `VPS_PORT`. No ambiente GitHub chamado `production`, configure os segredos `DOCKERHUB_TOKEN`, `VPS_SSH_PRIVATE_KEY` e `VPS_KNOWN_HOSTS`.

O usuário remoto precisa conseguir acessar `/opt/gym`, executar Docker Compose e autenticar no registry que contém as imagens privadas, caso aplicável. A chave pública correspondente ao segredo SSH deve estar autorizada no servidor.
