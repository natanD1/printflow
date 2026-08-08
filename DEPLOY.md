# Deploy — PrintFlow

Guia pra subir front (este repo), backend e MySQL num VPS próprio, usando Docker + nginx + subdomínios de `natandourado.com.br` (registro.br).

Domínios: `printflow.natandourado.com.br` (front) e `api.printflow.natandourado.com.br` (back).

## 1. DNS no registro.br

Painel → domínio `natandourado.com.br` → Editar Zona DNS. Cria 2 registros tipo **A**, apontando pro IP do VPS:

| Nome | Tipo | Valor |
|---|---|---|
| `printflow` | A | `SEU_IP_VPS` |
| `api.printflow` | A | `SEU_IP_VPS` |

O campo "Nome" leva **só** o pedaço do subdomínio (`printflow`, `api.printflow`) — o painel já concatena com `.natandourado.com.br` sozinho. Não digitar o domínio inteiro aí (foi isso que gerou `printflow.com.br.natandourado.com.br` antes).

Propagação leva de minutos a algumas horas.

## 2. Preparar o VPS (Ubuntu/Debian)

```bash
ssh usuario@SEU_IP_VPS

# Docker + compose
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker

# nginx + certbot (proxy reverso + SSL)
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx

# firewall — só 22/80/443 abertos, banco fica isolado no docker network
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## 3. Clonar os repos e montar o compose

```bash
mkdir -p ~/printflow && cd ~/printflow
git clone https://github.com/natanD1/printflowBack.git back
git clone <url-do-repo-front> front
```

`~/printflow/.env` (senhas/segredos reais, fora do git):

```
MYSQL_ROOT_PASSWORD=troque_isso
JWT_SECRET=troque_isso_min_32_chars
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
    # sem "ports:" — só acessível dentro da rede do compose, não exposto no host

  backend:
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

  frontend:
    build: ./front
    restart: unless-stopped
    environment:
      API_URL: http://backend:8080
      NODE_ENV: production
    depends_on:
      - backend
    ports:
      - "127.0.0.1:3000:3000"

volumes:
  mysql_data:
```

`frontend` fala com `backend` pela rede interna do Docker (`http://backend:8080`), não pelo domínio público — mesmo desenho de hoje (browser nunca fala direto com a API, só o Next server-side, ver seção "Dupla camada" no `CLAUDE.md`). Por isso não precisa de CORS no backend mesmo com domínios separados.

```bash
cd ~/printflow
docker compose --env-file .env up -d --build
```

### Aplicar as migrations (schema do banco)

A imagem de runtime do backend é só o binário publicado (sem `dotnet-ef`), então a migration não roda dentro do container. Jeito seguro, sem expor a porta 3306 pro mundo: abrir um túnel SSH da sua máquina pro VPS e rodar `dotnet ef database update` local apontando pro túnel.

```bash
# na sua máquina, numa aba separada — mantém o túnel aberto
ssh -L 3306:localhost:3306 usuario@SEU_IP_VPS -N
```

Isso só funciona se o MySQL do compose também expuser `127.0.0.1:3306:3306` temporariamente (adiciona no `docker-compose.yml`, sobe com `docker compose up -d mysql`, roda a migration, depois remove a porta e sobe de novo). Alternativa mais simples: publicar a porta do MySQL só em `127.0.0.1` no VPS (nunca em `0.0.0.0`) e sempre migrar via túnel SSH — nunca abrir 3306 no firewall.

Com o túnel de pé, na sua máquina (dentro do repo backend):

```bash
dotnet ef database update \
  --project src/PrintFlow.Infrastructure \
  --startup-project src/PrintFlow.WebApi \
  --connection "Server=localhost;Port=3306;Database=print_flow_db;User=root;Password=SUA_SENHA;"
```

## 4. Nginx (proxy reverso) + SSL

`/etc/nginx/sites-available/printflow-front`:
```nginx
server {
    server_name printflow.natandourado.com.br;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

`/etc/nginx/sites-available/printflow-api`:
```nginx
server {
    server_name api.printflow.natandourado.com.br;
    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/printflow-front /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/printflow-api /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# certbot preenche o bloco "listen 443" e "ssl_certificate" sozinho
sudo certbot --nginx -d printflow.natandourado.com.br -d api.printflow.natandourado.com.br
```

## 5. Redeploy depois de mudar código

```bash
cd ~/printflow/front && git pull   # ou back
cd ~/printflow
docker compose --env-file .env up -d --build frontend   # ou backend
```

## Checklist rápido

- [ ] Registros A criados no registro.br (`printflow` e `api.printflow`, campo "Nome" só com o subdomínio)
- [ ] Docker + nginx + certbot instalados no VPS
- [ ] `.env` com `MYSQL_ROOT_PASSWORD`/`JWT_SECRET` reais (nunca commitado)
- [ ] `docker compose up -d --build` rodando os 3 serviços
- [ ] Migrations aplicadas via túnel SSH (porta 3306 nunca exposta publicamente)
- [ ] nginx + certbot com SSL ativo nos dois subdomínios
- [ ] `ufw` só com 22/80/443 abertos
