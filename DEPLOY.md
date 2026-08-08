# Deploy — PrintFlow

Guia real (testado e funcionando) pra subir front (este repo), backend e MySQL no VPS, usando Docker + o Traefik **compartilhado** já existente no servidor (não um nginx dedicado — o servidor já tinha Traefik ocupando 80/443 pra outros projetos).

Domínios: `printflow.natandourado.com.br` (front) e `api.printflow.natandourado.com.br` (back).

## 0. Contexto importante: Traefik compartilhado

O VPS já roda um Traefik (do projeto MeetScheduleService, `/opt/10s/dev/MeetScheduleService/docker-compose.yml`) que atende **todos** os sites do servidor (vetpet, bardojacare, meetschedule, printflow), ocupando as portas 80/443. Não dá pra colocar um nginx próprio nelas — daria conflito de porta. O jeito é o PrintFlow entrar nessa mesma rede Docker (`meetscheduleservice_meetschedule-network`) e usar labels do Traefik pra registrar suas rotas.

**Regra de ouro:** nomeie os serviços do `docker-compose.yml` do PrintFlow com prefixo único (`printflow-backend`, `printflow-frontend`), **nunca** nomes genéricos tipo `backend`/`frontend`. Se outro projeto no mesmo servidor também tiver um serviço chamado `backend`, o DNS interno do Docker resolve o hostname pros **dois containers em round-robin** (mesma rede compartilhada = mesmo alias) — metade das requisições cai no container errado e retorna 404 aleatório, muito difícil de diagnosticar (já caímos nessa). Descoberta com `docker exec <container> node -e "require('dns').promises.lookup('backend',{all:true}).then(console.log)"` — se aparecer mais de um IP, é colisão de nome.

## 1. DNS no registro.br

Painel → domínio `natandourado.com.br` → Editar Zona DNS. Cria 2 registros tipo **A**, apontando pro IP do VPS:

| Nome | Tipo | Valor |
|---|---|---|
| `printflow` | A | `SEU_IP_VPS` |
| `api.printflow` | A | `SEU_IP_VPS` |

O campo "Nome" leva **só** o pedaço do subdomínio — o painel já concatena com `.natandourado.com.br` sozinho.

## 2. Clonar os repos e montar o compose

```bash
mkdir -p ~/printflow && cd ~/printflow
git clone https://github.com/natanD1/printflowBack.git back
git clone https://github.com/natanD1/printflow.git front
```

`~/printflow/.env` (senha só com letras/números — senha com `\`, `@`, `=` quebra o parser de connection string do MySqlConnector):

```
MYSQL_ROOT_PASSWORD=<openssl rand -hex 24>
JWT_SECRET=<openssl rand -base64 32>
```

`~/printflow/docker-compose.yml`:

```yaml
services:
  mysql:
    image: mysql:8.0
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: print_flow_db
    volumes:
      - mysql_data:/var/lib/mysql
    # sem "ports:" — só acessível dentro da rede do compose

  printflow-backend:
    build: ./back
    restart: unless-stopped
    environment:
      ConnectionStrings__DefaultConnection: "Server=mysql;Port=3306;Database=print_flow_db;User=root;Password=${MYSQL_ROOT_PASSWORD};"
      Jwt__Secret: ${JWT_SECRET}
      Jwt__Issuer: PrintFlow.WebApi
      Jwt__Audience: PrintFlow.Client
      Jwt__ExpirationMinutes: "60"
    depends_on:
      - mysql
    ports:
      - "127.0.0.1:4000:8080"
    networks:
      - default
      - traefik-shared
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.printflow-api.rule=Host(`api.printflow.natandourado.com.br`)"
      - "traefik.http.routers.printflow-api.entrypoints=web"
      - "traefik.http.routers.printflow-api.middlewares=redirect-to-https"
      - "traefik.http.routers.printflow-api-secure.rule=Host(`api.printflow.natandourado.com.br`)"
      - "traefik.http.routers.printflow-api-secure.entrypoints=websecure"
      - "traefik.http.routers.printflow-api-secure.tls=true"
      - "traefik.http.routers.printflow-api-secure.service=printflow-api"
      - "traefik.http.services.printflow-api.loadbalancer.server.port=8080"
      - "traefik.docker.network=meetscheduleservice_meetschedule-network"

  printflow-frontend:
    build: ./front
    restart: unless-stopped
    environment:
      API_URL: http://printflow-backend:8080
      NODE_ENV: production
    depends_on:
      - printflow-backend
    ports:
      - "127.0.0.1:3000:3000"
    networks:
      - default
      - traefik-shared
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.printflow-app.rule=Host(`printflow.natandourado.com.br`)"
      - "traefik.http.routers.printflow-app.entrypoints=web"
      - "traefik.http.routers.printflow-app.middlewares=redirect-to-https"
      - "traefik.http.routers.printflow-app-secure.rule=Host(`printflow.natandourado.com.br`)"
      - "traefik.http.routers.printflow-app-secure.entrypoints=websecure"
      - "traefik.http.routers.printflow-app-secure.tls=true"
      - "traefik.http.routers.printflow-app-secure.service=printflow-app"
      - "traefik.http.services.printflow-app.loadbalancer.server.port=3000"
      - "traefik.docker.network=meetscheduleservice_meetschedule-network"

volumes:
  mysql_data:

networks:
  traefik-shared:
    external: true
    name: meetscheduleservice_meetschedule-network
```

`API_URL` usa `http://printflow-backend:8080` — nome do serviço, não `backend` (ver regra de ouro acima). `frontend`/`backend` falam entre si pela rede interna do Docker, nunca pelo domínio público — sem CORS necessário mesmo com domínios separados (mesmo desenho de "dupla camada" do `CLAUDE.md`, browser nunca fala direto com a API).

```bash
cd ~/printflow
docker compose --env-file .env up -d --build
```

### Certificado SSL (reaproveitando certbot já instalado no servidor)

```bash
docker stop traefik   # container do Traefik compartilhado — ~15s de downtime nos outros sites
sudo certbot certonly --standalone \
  --config-dir /opt/10s/dev/MeetScheduleService/letsencrypt \
  --work-dir /opt/10s/dev/MeetScheduleService/letsencrypt \
  --logs-dir /opt/10s/dev/MeetScheduleService/letsencrypt \
  -d printflow.natandourado.com.br \
  -d api.printflow.natandourado.com.br
docker start traefik
```

```bash
sudo tee /opt/10s/dev/MeetScheduleService/traefik/dynamic/printflow-certs.yml << 'EOF'
tls:
  certificates:
    - certFile: /etc/letsencrypt/live/printflow.natandourado.com.br/fullchain.pem
      keyFile: /etc/letsencrypt/live/printflow.natandourado.com.br/privkey.pem
EOF
```

O Traefik observa essa pasta (`--providers.file.watch=true`) e aplica sozinho, sem reiniciar de novo.

### Aplicar as migrations (schema do banco)

A imagem de runtime do backend só tem o binário publicado (sem `dotnet-ef`). Roda um container temporário com o SDK, na mesma rede do compose, falando com o `mysql` direto pelo nome interno — sem expor porta nenhuma:

```bash
cat > ~/printflow/migrate.sh << 'EOF'
#!/bin/bash
set -e
dotnet tool install --global dotnet-ef
export PATH="$PATH:/root/.dotnet/tools"
dotnet restore PrintFlow.sln
dotnet ef database update \
  --project src/PrintFlow.Infrastructure \
  --startup-project src/PrintFlow.WebApi
EOF

docker run --rm -it \
  --network printflow_default \
  -v ~/printflow/back:/src \
  -v ~/printflow/migrate.sh:/migrate.sh \
  -w /src \
  -e ConnectionStrings__DefaultConnection='Server=mysql;Port=3306;Database=print_flow_db;User=root;Password=SUA_SENHA;' \
  -e Jwt__Secret='SEU_JWT_SECRET' \
  -e Jwt__Issuer='PrintFlow.WebApi' \
  -e Jwt__Audience='PrintFlow.Client' \
  -e Jwt__ExpirationMinutes='60' \
  mcr.microsoft.com/dotnet/sdk:8.0 \
  bash /migrate.sh
```

### Primeiro convite / primeiro admin

Não tem seed — o cadastro exige um código de convite válido, e virar admin exige `UPDATE` manual. Faz assim uma vez:

```bash
docker exec -i printflow-mysql-1 mysql -uroot -p'SUA_SENHA' print_flow_db -e "INSERT INTO invite_codes (Id, Code, Status, ExpiresAt, GeneratedByUserId, UsedByUserId, UsedAt, RevokedAt, CreatedAt, UpdatedAt) VALUES (UUID(), 'BOOTSTRAP001', 'Available', DATE_ADD(NOW(), INTERVAL 30 DAY), NULL, NULL, NULL, NULL, NOW(), NULL);"
```

Cadastra pelo site usando `BOOTSTRAP001`, depois:

```bash
docker exec -i printflow-mysql-1 mysql -uroot -p'SUA_SENHA' print_flow_db -e "UPDATE users SET IsAdmin = 1 WHERE Email = 'seu-email';"
```

Loga de novo (token novo com a claim de admin).

## 3. Redeploy depois de mudar código

```bash
cd ~/printflow/front && git pull   # ou back
cd ~/printflow
docker compose --env-file .env up -d --build printflow-frontend   # ou printflow-backend
```

## 4. Acessar o MySQL de produção com um client gráfico (Workbench etc)

Nunca expor 3306 pro mundo. Publica só em loopback e usa túnel SSH:

```yaml
# no serviço mysql do docker-compose.yml, temporariamente:
    ports:
      - "127.0.0.1:3308:3306"
```
```bash
docker compose --env-file .env up -d mysql
```
Na sua máquina:
```bash
ssh -L 3308:localhost:3308 usuario@SEU_IP_VPS -N
```
Conecta o client em `127.0.0.1:3308`. Remove a porta do compose depois de usar.

## Checklist rápido

- [ ] Registros A criados no registro.br (`printflow` e `api.printflow`)
- [ ] Serviços do compose com nome único (`printflow-backend`/`printflow-frontend`, nunca genérico — servidor compartilhado com outros projetos)
- [ ] `.env` com senha só alfanumérica (sem `\`, `@`, `=`, `;`)
- [ ] `docker compose up -d --build` rodando os 3 serviços
- [ ] Certificado emitido reaproveitando o certbot/config-dir do Traefik compartilhado
- [ ] Migrations aplicadas via container SDK temporário (sem expor porta do banco)
- [ ] Convite bootstrap criado + primeiro usuário promovido a admin
- [ ] 3306 nunca exposto publicamente (só túnel SSH quando precisar)
