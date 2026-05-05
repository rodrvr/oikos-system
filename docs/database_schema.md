# DATABASE SCHEMA DEFINITIVO

## PRINCIPIOS

- Multi-iglesia obligatorio
- Relaciones explícitas
- Escalable

## MODELOS

Usuario:
- Relación con Iglesia
- Relación con Rol

Evento:
- Pertenece a Iglesia

Inscripción:
- Relación Usuario + Evento

Solicitud:
- Usuario → Pastor

## ENUMS

TipoEvento:
- GRATIS
- PAGO

Estado:
- PENDIENTE
- APROBADO
- RECHAZADO