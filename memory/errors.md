# ERRORS

## FASE 2

### TAREA 9: Migración inicial
- FECHA: 2026-05-05
- ERROR: P1001 - Can't reach database server at localhost:5432
- CAUSA: No hay servidor PostgreSQL corriendo
- SOLUCIÓN: Iniciar PostgreSQL localmente o configurar DATABASE_URL correcta en prisma.config.ts/.env
