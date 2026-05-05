# DATOS DE PRUEBA - OIKOS SYSTEM

## Usuarios

| Rol | Email | Contrasena | RUT |
|-----|-------|-----------|-----|
| PASTOR | pastor@oikos.com | password123 | 11.111.111-1 |
| PRESIDENTE | presidente@oikos.com | password123 | 22.222.222-2 |
| MIEMBRO | miembro@oikos.com | password123 | 33.333.333-3 |
| MIEMBRO (Test) | test@oikos.com | password123 | 12.345.678-9 |

## Iglesias

| Nombre | Direccion |
|--------|-----------|
| Iglesia Central | Calle 123 |
| Iglesia Bautista Millaray | Av. Millaray 1234, Temuco |
| Primera Iglesia Bautista de Temuco | Manuel Bulnes 567, Temuco |
| Iglesia Bautista El Redentor | Calle Los Alamos 890, Temuco |
| Iglesia Bautista El Sembrador | Pasaje Las Rosas 234, Temuco |
| Iglesia Bautista Gracia y Verdad | Av. Alemania 456, Temuco |
| Iglesia Manantial de Vida | Calle Los Laureles 1122, Temuco |
| Iglesia La Ribera | Camino a Cajon 789, Temuco |

## Roles

| Nombre | ID |
|--------|----|
| PASTOR | 5bc5e036-cf16-4a76-ae2f-f4e169427c30 |
| PRESIDENTE | b5a44a96-c390-4a5b-8084-9c84ce0f11dc |
| ADMIN_EVENTOS | (creado por seed) |
| MIEMBRO | 8ce5822a-dca8-4a10-bbed-c7fcc220c3b6 |

## Notas

- Los usuarios pastor@oikos.com, presidente@oikos.com y miembro@oikos.com pertenecen a "Iglesia Central" (id: a21b5cbb-bc30-49d3-af94-c4ef67a45ac5)
- El usuario test@oikos.com tambien pertenece a Iglesia Central
- Las iglesias nuevas (Millaray, Temuco, etc.) tienen youtube_url placeholder
- Para registrar un nuevo usuario, selecciona una iglesia del dropdown en el formulario de registro
- El JWT expira en 24 horas
- Puerto backend por defecto: 3001
- URL frontend: http://localhost:3000
- API URL: http://localhost:3001

## Endpoints principales

- POST /auth/register - Registro
- POST /auth/login - Login
- GET /events - Eventos (autenticado)
- POST /inscriptions - Inscribirse a evento
- POST /requests - Crear solicitud
- GET /news - Noticias (publico)
- GET /verse/daily - Versiculo del dia (publico)
- GET /churches - Iglesias (publico)
- GET /events/global - Eventos globales (publico)
