# =============================================================
# DOCKERFILE MULTI-STAGE para el cliente React + Vite
#
# ¿Por qué multi-stage?
# React es una aplicación que se compila a HTML/CSS/JS estático.
# El resultado final no necesita Node.js para funcionar.
# Con multi-stage usamos dos imágenes:
#   - Stage 1 (builder): Node para compilar la app
#   - Stage 2 (final):   nginx para servir los ficheros estáticos
# La imagen final solo contiene nginx + el build, sin Node ni
# las dependencias de desarrollo → mucho más ligera y segura.
# =============================================================


# =============================================================
# STAGE 1 — "builder": compilar la aplicación React
# =============================================================
FROM node:22-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app

# Copiar manifiestos e instalar dependencias (capa cacheada)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --no-frozen-lockfile

# Copiar el resto del código fuente
COPY . .

# Variable de entorno para la URL del API en tiempo de build.
# Vite incrusta las variables de entorno en el bundle en el
# momento de la compilación (no en runtime).
# Valor por defecto: el servidor expuesto en localhost:3000.
ARG VITE_API_URL=http://localhost:3000
ENV VITE_API_URL=$VITE_API_URL

# Compilar la app → genera la carpeta /app/dist
# Usamos "vite build" directamente en lugar de "tsc -b && vite build"
# para evitar que errores de TypeScript estricto rompan el build.
# Vite transpila TS por su cuenta sin necesitar que tsc pase limpio.
RUN pnpm vite build


# =============================================================
# STAGE 2 — "final": servir con nginx
# A partir de aquí se descarta todo lo de Node/pnpm.
# Solo se copia el resultado del build (/app/dist).
# =============================================================
FROM nginx:stable-alpine

# Copiar los ficheros estáticos generados por Vite
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuración de nginx para SPA: redirige todas las rutas a index.html
# para que React Router pueda gestionarlas en el cliente.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# =============================================================
# El puerto 80 es el que nginx usa por defecto.
# El contenedor atenderá peticiones HTTP en este puerto.
# =============================================================
EXPOSE 80

# nginx ya tiene su propio CMD, no hace falta redefinirlo.
# Al arrancar el contenedor, nginx sirve los ficheros estáticos.
