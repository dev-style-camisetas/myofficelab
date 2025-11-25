# Etapa 1 — Build
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


# Etapa 2 — Servir com Nginx
FROM nginx:alpine

# Copia o build do Vite para o Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expor a porta padrão do Nginx
EXPOSE 80

# Start do nginx
CMD ["nginx", "-g", "daemon off;"]
