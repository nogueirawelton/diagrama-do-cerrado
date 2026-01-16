
# 1. Base com correções de biblioteca
FROM node:25-alpine AS node
RUN apk add --no-cache libc6-compat

# 2. Preparação dos manifestos
FROM node AS base
WORKDIR /home/node

COPY package*.json ./
COPY server/package*.json ./server/
COPY app/package*.json ./app/

# 3. Build do Servidor (Backend)
FROM base AS server-builder
WORKDIR /home/node/server

RUN npm install
COPY server .
RUN npm run build

# 4. Build do Next.js (Frontend)
FROM base AS app-builder
WORKDIR /home/node/app

RUN npm install
COPY app .
RUN npm run build

# --- ETAPA FINAL: PRODUÇÃO ---
FROM node AS runner
WORKDIR /home/node

# Configuração para o Servidor NestJS
COPY --from=server-builder /home/node/server/dist ./server/dist
COPY --from=server-builder /home/node/server/node_modules ./server/node_modules

# Configuração para o Next.js (Frontend)
COPY --from=app-builder /home/node/app/.next ./app/.next
COPY --from=app-builder /home/node/app/public ./app/public
COPY --from=app-builder /home/node/app/node_modules ./app/node_modules
COPY --from=app-builder /home/node/app/package*.json ./app/


CMD ["sh", "-c", "node server/dist/database/seeds/index.js && node server/dist/main.js & cd app && npm run start"]