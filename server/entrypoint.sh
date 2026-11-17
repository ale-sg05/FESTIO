#!/bin/sh
set -e

echo "⏳ Aplicando esquema en la base de datos (prisma db push)..."
pnpm prisma db push

echo "🌱 Ejecutando seed inicial..."
pnpm prisma db seed

echo "🚀 Arrancando el servidor..."
exec pnpm tsx src/index.ts
