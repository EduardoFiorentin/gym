docker run -d \
  --name postgres \
  -e POSTGRES_PASSWORD=postgres \
  -v gym_default:/var/lib/postgresql \
  -v ../database:/sql \
  -p 5432:5432 \
  postgres:15-alpine
