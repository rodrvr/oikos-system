# ARQUITECTURA

## MODELO

- Multi-tenant (por iglesia)
- Roles jerárquicos

## CAPAS

1. Frontend (Next.js)
2. Backend (Express)
3. DB (PostgreSQL)

## SEPARACIÓN

- Frontend NO accede a DB
- Backend maneja lógica
- DB solo datos

## ENTIDADES

- Usuario
- Iglesia
- Evento
- Inscripción
- Solicitud
- Rol