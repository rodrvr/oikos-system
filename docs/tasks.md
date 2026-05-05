# TASKS - FASE 1

---

## TAREA 1: Crear estructura base del proyecto

INPUT:
architecture.md

OUTPUT:
Estructura de carpetas creada

ACCIONES:
- Crear carpeta /oikos-system
- Crear subcarpetas:
  - /docs
  - /memory
  - /app
- Dentro de /app crear:
  - /backend
  - /frontend

REGLAS:
- No agregar otras carpetas

---

## TAREA 2: Inicializar backend

INPUT:
backend_spec.md

OUTPUT:
Proyecto Node.js inicializado

ACCIONES:
- Entrar a /app/backend
- Ejecutar:
  npm init -y
- Instalar dependencias:
  express
  cors
  dotenv

REGLAS:
- No instalar otras librerías

---

## TAREA 3: Inicializar frontend

INPUT:
frontend_spec.md

OUTPUT:
Proyecto Next.js creado

ACCIONES:
- Entrar a /app/frontend
- Ejecutar:
  npx create-next-app@latest .

CONFIGURACIÓN:
- TypeScript: YES
- App Router: YES
- Tailwind: YES
- ESLint: YES

REGLAS:
- No modificar configuración

---

## TAREA 4: Instalar Prisma en backend

INPUT:
database_schema.md

OUTPUT:
Prisma instalado

ACCIONES:
- En /app/backend ejecutar:
  npm install prisma --save-dev
  npm install @prisma/client
- Inicializar:
  npx prisma init

REGLAS:
- No modificar schema aún

---

## TAREA 5: Configurar conexión base a DB

INPUT:
database_schema.md

OUTPUT:
.env configurado

ACCIONES:
- Editar archivo .env
- Agregar:

DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/oikos"

REGLAS:
- No crear tablas aún

---

## TAREA 6: Crear servidor Express básico

INPUT:
backend_spec.md

OUTPUT:
Servidor corriendo

ACCIONES:
- Crear archivo index.js
- Configurar:
  express
  cors
  json middleware

- Crear ruta:
  GET /

RESPUESTA:
"Oikos API running"

REGLAS:
- No crear endpoints reales

---

## TAREA 7: Validación de fase

INPUT:
validation_rules.md

OUTPUT:
Checklist completado

CHECKLIST:
- Backend inicia sin errores
- Frontend corre en localhost
- Prisma instalado
- Estructura correcta

SI FALLA:
Registrar en errors.md

---

# FASE 2 - BASE DE DATOS

## TAREA 8: Definir schema Prisma

INPUT:
database_schema.md

OUTPUT:
schema.prisma completo

ACCIONES:
- Editar /app/backend/prisma/schema.prisma
- Definir datasource PostgreSQL
- Definir generator client

MODELOS:

Usuario:
- id (uuid)
- nombre
- email (unique)
- password
- rut (unique)
- direccion
- telefono
- telefono_emergencia
- fecha_nacimiento
- foto_url
- iglesia_id
- rol_id
- created_at

Iglesia:
- id (uuid)
- nombre
- direccion
- historia
- created_at

Rol:
- id (uuid)
- nombre

Evento:
- id (uuid)
- titulo
- descripcion
- fecha
- cupos
- tipo (gratis/pago)
- iglesia_id
- created_at

Inscripcion:
- id (uuid)
- usuario_id
- evento_id
- estado (pendiente/aprobado/rechazado)
- comprobante_url (opcional)
- created_at

Solicitud:
- id (uuid)
- usuario_id
- pastor_id
- mensaje
- estado (pendiente/aprobado/rechazado)
- fecha_solicitada
- created_at

RELACIONES:

- Usuario → Iglesia (many to one)
- Usuario → Rol (many to one)
- Evento → Iglesia
- Inscripcion → Usuario
- Inscripcion → Evento
- Solicitud → Usuario
- Solicitud → Pastor (Usuario)

REGLAS:
- Usar @id @default(uuid())
- Usar @relation correctamente
- No inventar campos extra
## TAREA 9: Ejecutar migración inicial

INPUT:
schema.prisma

OUTPUT:
Base de datos creada

ACCIONES:
- Ejecutar:
  npx prisma migrate dev --name init

REGLAS:
- No modificar schema durante migración

## TAREA 10: Generar cliente Prisma

INPUT:
schema.prisma

OUTPUT:
Cliente generado

ACCIONES:
- Ejecutar:
  npx prisma generate

  ## TAREA 11: Validación de relaciones

INPUT:
validation_rules.md

OUTPUT:
Checklist completo

CHECKLIST:
- Todas las relaciones funcionan
- No hay duplicados
- UUID en todos los IDs
- Foreign keys correctas

SI FALLA:
Registrar en errors.md

---

# FASE 3 - BACKEND

## TAREA 12: Crear estructura profesional

INPUT:
backend_spec.md

OUTPUT:
Estructura creada

ACCIONES:
- Crear carpetas dentro de /src:
  controllers
  services
  routes
  middlewares
  utils
  config

REGLAS:
- No crear archivos aún

## TAREA 13: Configurar servidor con estructura

INPUT:
backend_spec.md

OUTPUT:
Servidor usando estructura

ACCIONES:
- Mover lógica de index.js a usar:
  - routes
- Configurar express con:
  cors
  json
- Importar rutas desde /src/routes

REGLAS:
- No lógica de negocio aquí

## TAREA 14: Configurar Prisma client

INPUT:
database_schema.md

OUTPUT:
Cliente reutilizable

ACCIONES:
- Crear /src/config/prisma.js
- Inicializar PrismaClient

REGLAS:
- Singleton
- No múltiples instancias

## TAREA 15: Crear módulo Auth

INPUT:
backend_spec.md

OUTPUT:
Auth funcional

ACCIONES:

CREAR:

/controllers/auth.controller.js  
/services/auth.service.js  
/routes/auth.routes.js  

FUNCIONES:

REGISTER:
- Crear usuario
- Hash password

LOGIN:
- Validar credenciales
- Generar JWT

REGLAS:
- Usar bcrypt
- Usar jsonwebtoken
- No lógica en controller

## TAREA 16: Middleware de autenticación

INPUT:
backend_spec.md

OUTPUT:
Middleware JWT

ACCIONES:
- Crear /middlewares/auth.middleware.js
- Validar token
- Agregar usuario a request

REGLAS:
- Rechazar si no hay token

## TAREA 17: Conectar rutas

INPUT:
backend_spec.md

OUTPUT:
Rutas funcionando

ACCIONES:
- Registrar:
  /auth
- Conectar controller con routes

REGLAS:
- Usar express.Router

## TAREA 18: Validación backend

INPUT:
validation_rules.md

OUTPUT:
Checklist completo

CHECKLIST:
- Auth funciona
- JWT válido
- Password hasheado
- No lógica en controllers
- Prisma funcionando

SI FALLA:
Registrar en errors.md

---

# FASE 4 - USUARIOS Y ROLES

## TAREA 19: Crear módulo Usuario

INPUT:
backend_spec.md

OUTPUT:
CRUD usuarios

ACCIONES:

CREAR:

/controllers/user.controller.js  
/services/user.service.js  
/routes/user.routes.js  

FUNCIONES:

- GET /users
- GET /users/:id
- POST /users
- PUT /users/:id
- DELETE /users/:id

REGLAS:
- Usar Prisma
- No lógica en controller
- Respetar estructura service
## TAREA 20: Filtro por iglesia

INPUT:
database_schema.md

OUTPUT:
Usuarios filtrados correctamente

ACCIONES:
- En services:
  Filtrar usuarios por iglesia_id del token

REGLAS:
- Nunca devolver usuarios de otra iglesia

## TAREA 21: Middleware de roles

INPUT:
backend_spec.md

OUTPUT:
Protección por roles

ACCIONES:
- Crear /middlewares/role.middleware.js

FUNCIONALIDAD:
- Recibe roles permitidos
- Verifica rol del usuario

REGLAS:
- Bloquear acceso si no cumple

## TAREA 22: Restringir endpoints

INPUT:
backend_spec.md

OUTPUT:
Endpoints protegidos

ACCIONES:

- Solo Pastor/Presidente:
  - Crear usuarios
  - Eliminar usuarios

- Usuarios normales:
  - Solo ver su perfil

REGLAS:
- Aplicar middleware de roles

## TAREA 23: Relación usuario-rol correcta

INPUT:
database_schema.md

OUTPUT:
Roles funcionando

ACCIONES:
- Asegurar que rol_id se use correctamente
- Incluir rol en respuestas

REGLAS:
- No duplicar información

## TAREA 24: Validación fase

INPUT:
validation_rules.md

OUTPUT:
Checklist completo

CHECKLIST:

- CRUD funciona
- Usuarios filtrados por iglesia
- Roles restringen acceso
- No acceso cruzado entre iglesias
- Middleware funciona

SI FALLA:
Registrar en errors.md

---

# FASE 5 - EVENTOS E INSCRIPCIONES

## TAREA 25: Crear módulo Evento

INPUT:
backend_spec.md

OUTPUT:
CRUD eventos

ACCIONES:

CREAR:

/controllers/event.controller.js  
/services/event.service.js  
/routes/event.routes.js  

FUNCIONES:

- GET /events
- GET /events/:id
- POST /events
- PUT /events/:id
- DELETE /events/:id

REGLAS:
- Filtrar por iglesia_id
- No lógica en controller

## TAREA 26: Validar cupos

INPUT:
database_schema.md

OUTPUT:
Control de capacidad

ACCIONES:
- En service:
  Contar inscripciones aprobadas
  Comparar con cupos

REGLAS:
- No permitir sobrecupos

## TAREA 27: Crear módulo Inscripción

INPUT:
backend_spec.md

OUTPUT:
Sistema de inscripción

ACCIONES:

CREAR:

/controllers/inscription.controller.js  
/services/inscription.service.js  
/routes/inscription.routes.js  

FUNCIONES:

- POST /inscriptions
- GET /inscriptions/event/:id

REGLAS:
- Usuario autenticado
- Evento de su iglesia

## TAREA 28: Lógica de inscripción

INPUT:
database_schema.md

OUTPUT:
Flujo correcto

ACCIONES:

SI evento GRATIS:
- estado = APROBADO

SI evento PAGO:
- estado = PENDIENTE

REGLAS:
- No duplicar inscripción
- Validar cupo antes

## TAREA 29: Aprobación de inscripciones

INPUT:
backend_spec.md

OUTPUT:
Sistema de aprobación

ACCIONES:

- PUT /inscriptions/:id

FUNCIONALIDAD:

- Aprobar → estado APROBADO
- Rechazar → estado RECHAZADO

REGLAS:
- Solo ADMIN_EVENTOS / PASTOR

## TAREA 30: Subida de comprobante

INPUT:
backend_spec.md

OUTPUT:
Campo funcional

ACCIONES:
- Permitir enviar comprobante_url

REGLAS:
- Solo para eventos de pago

## TAREA 31: Seguridad multi-iglesia

INPUT:
database_schema.md

OUTPUT:
Aislamiento correcto

ACCIONES:
- Validar:
  usuario.iglesia_id == evento.iglesia_id

REGLAS:
- Bloquear si no coincide

## TAREA 32: Validación fase

INPUT:
validation_rules.md

OUTPUT:
Checklist completo

CHECKLIST:

- CRUD eventos funciona
- Cupos respetados
- Inscripciones funcionan
- Estados correctos
- No duplicados
- Multi-iglesia seguro

SI FALLA:
Registrar en errors.md

---

# FASE 6 - SOLICITUDES

## TAREA 33: Crear módulo Solicitud

INPUT:
backend_spec.md

OUTPUT:
CRUD solicitudes

ACCIONES:

CREAR:

/controllers/request.controller.js  
/services/request.service.js  
/routes/request.routes.js  

FUNCIONES:

- POST /requests
- GET /requests
- GET /requests/:id

REGLAS:
- Usuario autenticado
- No lógica en controller
## TAREA 34: Crear solicitud

INPUT:
database_schema.md

OUTPUT:
Solicitud registrada

ACCIONES:

- Crear solicitud con:
  usuario_id
  pastor_id
  mensaje
  estado = PENDIENTE

REGLAS:
- Usuario y pastor deben ser de la misma iglesia
## TAREA 35: Vista por rol

INPUT:
backend_spec.md

OUTPUT:
Filtrado correcto

ACCIONES:

SI usuario normal:
- Ver solo sus solicitudes

SI pastor:
- Ver solicitudes dirigidas a él

REGLAS:
- Filtrar por iglesia_id
## TAREA 36: Respuesta del pastor

INPUT:
backend_spec.md

OUTPUT:
Sistema de respuesta

ACCIONES:

- PUT /requests/:id

FUNCIONALIDAD:

- estado:
  APROBADO
  RECHAZADO

- fecha_solicitada (opcional)

REGLAS:
- Solo el pastor asignado puede responder
## TAREA 37: Seguridad multi-iglesia

INPUT:
database_schema.md

OUTPUT:
Aislamiento correcto

ACCIONES:
- Validar:
  usuario.iglesia_id == pastor.iglesia_id

REGLAS:
- Bloquear si no coincide
## TAREA 38: Validación fase

INPUT:
validation_rules.md

OUTPUT:
Checklist completo

CHECKLIST:

- Solicitudes se crean
- Pastor puede responder
- Usuarios ven solo lo suyo
- No acceso cruzado
- Estados correctos

SI FALLA:
Registrar en errors.md

---

# FASE 7 - PORTAL

## TAREA 39: Crear módulo Noticias

INPUT:
backend_spec.md

OUTPUT:
CRUD noticias

ACCIONES:

CREAR:

/controllers/news.controller.js  
/services/news.service.js  
/routes/news.routes.js  

FUNCIONES:

- GET /news
- POST /news
- PUT /news/:id
- DELETE /news/:id

REGLAS:
- Solo ADMIN / PASTOR crean
- Público puede ver

## TAREA 40: Versículo del día

INPUT:
backend_spec.md

OUTPUT:
Endpoint versículo

ACCIONES:

CREAR:

/services/verse.service.js  
/controllers/verse.controller.js  
/routes/verse.routes.js  

FUNCIONALIDAD:

- GET /verse/daily

COMPORTAMIENTO:

- Retornar versículo aleatorio o externo

REGLAS:
- No hardcodear múltiples
- Puede usar lista simple inicial

## TAREA 41: Información de iglesias

INPUT:
database_schema.md

OUTPUT:
Endpoint público

ACCIONES:

- GET /churches
- GET /churches/:id

DATOS:
- nombre
- direccion
- historia

REGLAS:
- Público
## TAREA 42: Eventos globales

INPUT:
backend_spec.md

OUTPUT:
Eventos visibles globalmente

ACCIONES:

- Agregar flag:
  es_global (boolean)

- GET /events/global

REGLAS:
- Visible a todas las iglesias
## TAREA 43: Seguridad contenido

INPUT:
backend_spec.md

OUTPUT:
Acceso controlado

ACCIONES:

- Noticias:
  solo admin crea

- Versículo:
  público

- Iglesias:
  público

REGLAS:
- No mezclar permisos
## TAREA 44: Validación fase

INPUT:
validation_rules.md

OUTPUT:
Checklist completo

CHECKLIST:

- Noticias funcionan
- Versículo endpoint responde
- Iglesias visibles
- Eventos globales visibles
- Permisos correctos

SI FALLA:
Registrar en errors.md

---

# FASE 8 - FRONTEND

## TAREA 45: Estructura base UI

INPUT:
frontend_spec.md

OUTPUT:
Layout base

ACCIONES:

CREAR:

/components
/pages (o app router)
/layouts

COMPONENTES:

- Navbar
- Sidebar
- Footer

REGLAS:
- Reutilizable
- No lógica compleja

## TAREA 46: Sistema de autenticación UI

INPUT:
backend_spec.md

OUTPUT:
Login/Register UI

ACCIONES:

- Crear páginas:
  /login
  /register

FUNCIONALIDAD:

- Formulario
- Llamadas API
- Guardar JWT

REGLAS:
- Manejar errores

## TAREA 47: Dashboard

INPUT:
backend_spec.md

OUTPUT:
Panel principal

ACCIONES:

- Vista resumen:
  - Eventos
  - Solicitudes
  - Noticias

REGLAS:
- Basado en rol

## TAREA 48: Vista eventos

INPUT:
backend_spec.md

OUTPUT:
Eventos UI

ACCIONES:

- Listado eventos
- Botón inscribirse
- Estado inscripción

REGLAS:
- Mostrar cupos

## TAREA 49: Vista solicitudes

INPUT:
backend_spec.md

OUTPUT:
Solicitudes UI

ACCIONES:

- Crear solicitud
- Ver estado
- Responder (pastor)

REGLAS:
- Filtrar por rol

## TAREA 50: Portal público

INPUT:
backend_spec.md

OUTPUT:
Home pública

ACCIONES:

- Mostrar:
  - Noticias
  - Versículo del día
  - Eventos globales

REGLAS:
- Sin login

## TAREA 51: Streaming

INPUT:
backend_spec.md

OUTPUT:
Vista en vivo

ACCIONES:

- Página /live
- Embed YouTube

REGLAS:
- Responsive

## TAREA 52: Dark mode

INPUT:
frontend_spec.md

OUTPUT:
Modo oscuro

ACCIONES:

- Toggle dark/light
- Persistir preferencia

REGLAS:
- Mantener contraste

## TAREA 53: Animaciones

INPUT:
frontend_spec.md

OUTPUT:
UX mejorada

ACCIONES:

- Transiciones suaves
- Hover effects

REGLAS:
- No exagerar

## TAREA 54: Validación fase

INPUT:
validation_rules.md

OUTPUT:
Checklist completo

CHECKLIST:

- UI funcional
- Auth funciona
- Consumo API correcto
- Responsive
- Dark mode OK
- Accesible

SI FALLA:
Registrar en errors.md

---

# FASE 9 - PRODUCCIÓN

## TAREA 55: Manejo global de errores

INPUT:
backend_spec.md

OUTPUT:
Errores controlados

ACCIONES:

- Crear middleware global:
  /middlewares/error.middleware.js

FUNCIONALIDAD:

- Capturar errores
- Responder JSON estándar

REGLAS:
- No exponer stacktrace
## TAREA 56: Validaciones de input

INPUT:
validation_rules.md

OUTPUT:
Inputs seguros

ACCIONES:

- Validar:
  email
  password
  rut
  campos obligatorios

REGLAS:
- Rechazar datos inválidos
## TAREA 57: Seguridad backend

INPUT:
backend_spec.md

OUTPUT:
API protegida

ACCIONES:

- Limitar intentos login (rate limit básico)
- Sanitizar inputs
- Validar JWT en rutas protegidas

REGLAS:
- No confiar en frontend
## TAREA 58: Optimización frontend

INPUT:
frontend_spec.md

OUTPUT:
Mejor rendimiento

ACCIONES:

- Lazy loading
- Optimizar imágenes
- Reducir renders innecesarios

REGLAS:
- No romper UI
## TAREA 59: Accesibilidad WCAG

INPUT:
frontend_spec.md

OUTPUT:
UI accesible

ACCIONES:

- Contraste correcto
- Labels en inputs
- Navegación teclado

REGLAS:
- Cumplir WCAG básico
## TAREA 60: UX final

INPUT:
frontend_spec.md

OUTPUT:
Experiencia pulida

ACCIONES:

- Estados de carga
- Mensajes de error claros
- Feedback visual
- Mejorar visual con skill impeccable
- Mejorar animaciones con skill gsap

REGLAS:
- No dejar pantallas vacías
## TAREA 61: Preparación deploy

INPUT:
architecture.md

OUTPUT:
Proyecto listo

ACCIONES:

- Variables de entorno listas
- Configurar scripts:
  build
  start

REGLAS:
- No hardcodear datos
## TAREA 62: Validación final

INPUT:
validation_rules.md

OUTPUT:
Checklist completo

CHECKLIST:

- Backend seguro
- Frontend optimizado
- UX completa
- Sin errores críticos
- Listo para producción

SI FALLA:
Registrar en errors.md
---

# FASE 10 - DEPLOY

## TAREA 63: Preparar backend para producción

INPUT:
deploy.md

OUTPUT:
Backend listo

ACCIONES:

- Verificar uso de process.env.PORT
- Verificar scripts en package.json
- Verificar Prisma config

REGLAS:
- No cambiar lógica
## TAREA 64: Configurar Railway

INPUT:
deploy.md

OUTPUT:
Proyecto desplegado

ACCIONES:

- Crear proyecto en Railway
- Conectar repo
- Seleccionar /app/backend

REGLAS:
- No cambiar estructura
## TAREA 65: Configurar base de datos

INPUT:
deploy.md

OUTPUT:
DB conectada

ACCIONES:

- Agregar PostgreSQL
- Verificar DATABASE_URL

REGLAS:
- No modificar schema
## TAREA 66: Ejecutar migraciones

INPUT:
deploy.md

OUTPUT:
DB operativa

ACCIONES:

- Ejecutar:
  npx prisma migrate deploy
  npx prisma generate

REGLAS:
- No modificar migraciones
## TAREA 67: Configurar variables entorno

INPUT:
deploy.md

OUTPUT:
Variables correctas

ACCIONES:

- Agregar:
  DATABASE_URL
  JWT_SECRET

REGLAS:
- No hardcodear valores
## TAREA 68: Deploy frontend

INPUT:
deploy.md

OUTPUT:
Frontend desplegado

ACCIONES:

- Importar en Vercel
- Seleccionar /app/frontend

REGLAS:
- No cambiar build config
## TAREA 69: Conectar frontend-backend

INPUT:
deploy.md

OUTPUT:
Sistema conectado

ACCIONES:

- Definir NEXT_PUBLIC_API_URL

REGLAS:
- Usar URL pública backend
## TAREA 70: Validación final deploy

INPUT:
validation_rules.md

OUTPUT:
Sistema funcional

CHECKLIST:

- Backend responde
- Frontend carga
- Login funciona
- DB guarda datos
- Eventos funcionan

SI FALLA:
Registrar en deploy_status.md