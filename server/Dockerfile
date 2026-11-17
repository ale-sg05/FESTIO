# =============================================================
# PASO 1 — Imagen base
# Usamos Node 22 en su variante Alpine (ligera, ~50 MB)
# =============================================================
FROM node:22-alpine

# =============================================================
# PASO 2 — Instalar pnpm globalmente
# Docker instala pnpm dentro del contenedor, así que el profesor
# no necesita tenerlo en su máquina, solo Docker.
# =============================================================
RUN npm install -g pnpm

# =============================================================
# PASO 3 — Directorio de trabajo dentro del contenedor
# Todos los comandos siguientes se ejecutarán aquí
# =============================================================
WORKDIR /app

# =============================================================
# PASO 4 — Instalar dependencias
# Copiamos PRIMERO los manifiestos de paquetes para aprovechar
# la caché de Docker: si el código fuente cambia pero no el
# package.json, Docker reutiliza esta capa y no reinstala todo.
# =============================================================
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --no-frozen-lockfile

# =============================================================
# PASO 5 — Copiar el código fuente y configuración de Prisma
# =============================================================
COPY prisma ./prisma
COPY prisma.config.ts ./
COPY src ./src

# =============================================================
# PASO 6 — Generar el cliente de Prisma
# Esto crea el código TypeScript generado para acceder a la BD.
# No necesita conexión a la base de datos, solo el schema.
# =============================================================
RUN pnpm prisma generate

# =============================================================
# PASO 7 — Copiar el entrypoint y darle permisos de ejecución
# El entrypoint aplica el schema en la BD y luego arranca el
# servidor, asegurando que la BD esté lista antes de iniciar.
# =============================================================
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

# =============================================================
# PASO 8 — Exponer el puerto que usa Express (3000 por defecto)
# Esto es declarativo: informa a Docker qué puerto usará el
# contenedor, pero no lo publica en el host por sí solo.
# =============================================================
EXPOSE 3000

# =============================================================
# PASO 9 — Punto de entrada del contenedor
# Se ejecuta cada vez que el contenedor arranca.
# =============================================================
ENTRYPOINT ["./entrypoint.sh"]
