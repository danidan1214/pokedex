# ---------- Stage 1: Build ----------
FROM node:22-alpine AS build

WORKDIR /app

# Aprovecha la caché de capas: copia solo los manifiestos de dependencias
COPY package.json package-lock.json ./

# Instala dependencias (usa el lockfile para builds reproducibles)
RUN npm ci

# Copia el resto del código fuente
COPY . .

# Compila TypeScript y genera el bundle de producción en /app/dist
RUN npm run build

# ---------- Stage 2: Serve ----------
FROM nginx:1.27-alpine AS serve

# Limpia el contenido por defecto de nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia los artefactos de build
COPY --from=build /app/dist /usr/share/nginx/html

# Configuración de nginx para SPA (fallback a index.html) y caché de assets
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]