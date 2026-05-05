# DEPLOY STATUS

Backend:
- Estado: CONFIGURADO (Railway)
- URL: Pendiente de deploy
- Config: Procfile + railway.json creados

Frontend:
- Estado: CONFIGURADO (Vercel)
- URL: Pendiente de deploy
- Config: vercel.json creado

Database:
- Estado: LOCAL OK (migraciones ejecutadas)
- Railway: Usar PostgreSQL plugin

Errores:
- Ninguno

## PASOS PARA DEPLOY

1. Railway: Importar repo GitHub, seleccionar /app/backend
2. Railway: Agregar PostgreSQL plugin
3. Railway: Configurar JWT_SECRET en variables de entorno
4. Vercel: Importar proyecto, seleccionar /app/frontend
5. Vercel: Configurar NEXT_PUBLIC_API_URL con URL del backend
