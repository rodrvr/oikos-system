# DEPLOY GUIDE - OIKOS

## BACKEND - RAILWAY

1. Crear proyecto desde GitHub
2. Seleccionar carpeta /app/backend

## BASE DE DATOS

- Agregar PostgreSQL plugin
- Usar DATABASE_URL generado

## VARIABLES

- DATABASE_URL
- JWT_SECRET

## MIGRACIONES

Ejecutar:

npx prisma migrate deploy
npx prisma generate

## FRONTEND - VERCEL

1. Importar proyecto
2. Seleccionar /app/frontend

## VARIABLES

NEXT_PUBLIC_API_URL=<backend_url>

## CORS

Permitir dominio frontend

## RESULTADO

- Backend público
- Frontend público