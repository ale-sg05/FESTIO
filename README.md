# fest.io — Plataforma de Gestión y Venta de Abonos de Festivales

**Práctica Final — Plataformas de Software Empresariales**  
Universidad de Valladolid · Escuela de Ingeniería Informática de Segovia  
Grado en Ingeniería Informática de Servicios y Aplicaciones

**Autores:** Alejandro Martín Martín & Héctor Torres Bolufer  
**Tutor:** Samuel Encinas Plaza

---

> 📄 **La documentación oficial completa del proyecto se encuentra en [`Memoria.pdf`](./Memoria.pdf).**  
> Este archivo recoge la memoria del proyecto, la documentación técnica (análisis, diseño, implementación y pruebas) y los manuales de instalación y usuario.

---

## Descripción

**fest.io** es una plataforma web para la gestión y venta de abonos de festivales musicales. Centraliza la publicación de eventos, la compra segura de entradas mediante pasarela de pago y la generación de códigos QR únicos por abono.

La plataforma da servicio a tres tipos de usuarios:

- **Administrador** — verifica y bloquea empresas gestoras, y accede a los logs del servidor.
- **Empresa gestora** — registra y gestiona festivales, artistas y tipos de abono.
- **Cliente** — consulta festivales, compra abonos, gestiona su saldo (pulsera cashless) y visualiza sus tickets con código QR.

## Stack tecnológico

| Capa | Tecnologías |
|---|---|
| Frontend | React + Vite, TypeScript, TailwindCSS, React Router |
| Backend | Node.js, Express, TypeScript, Passport.js + JWT, Zod, Pino |
| ORM / BD | Prisma ORM + PostgreSQL |
| Infraestructura | Docker, Docker Compose, nginx |
| APIs externas | Pasarela de pagos S. Encinas, proxy Spotify (música), Unsplash (imágenes) |
| Documentación API | OpenAPI / SwaggerUI |

## Estructura del repositorio

```
.
├── Memoria.pdf          ← Documentación oficial del proyecto
├── docker-compose.yml   ← Orquestador de los tres servicios
├── .env.example         ← Plantilla de variables de entorno
├── client/              ← Aplicación React (Vite)
│   ├── src/
│   └── Dockerfile
└── server/              ← API REST Express + Prisma
    ├── src/
    │   ├── controllers/
    │   ├── routes/      ← /auth, /enterprise, /client, /festival, /artist, /logs
    │   ├── services/
    │   └── docs/        ← Especificación OpenAPI
    ├── prisma/
    │   ├── schema.prisma
    │   └── seed.ts
    └── Dockerfile
```

## Instalación y puesta en marcha

La guía completa con capturas se encuentra en el **Manual de Instalación** dentro de [`Memoria.pdf`](./Memoria.pdf) (Parte III, Capítulo 8). A continuación se resume el proceso:

### Requisitos previos

- [Docker](https://www.docker.com/) y Docker Compose instalados.

### Pasos

**1. Clonar el repositorio**

```bash
git clone <url-del-repositorio>
cd "Práctica Final"
```

**2. Configurar las variables de entorno**

```bash
cp .env.example .env
```

Edita `.env` con tus valores reales:

```env
JWT_SECRET=cambia_esto_por_un_secreto_muy_largo_y_aleatorio
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin_password_segura

S_ENCINAS_API_USERNAME=tu_usuario
S_ENCINAS_API_PASSWORD=tu_contraseña

UNSPLASH_API_KEY=tu_api_key_de_unsplash
```

**3. Levantar la aplicación**

```bash
docker compose up --build
```

Docker levantará tres servicios:

| Servicio | Puerto | Descripción |
|---|---|---|
| `client` (nginx) | `http://localhost:80` | Aplicación React |
| `server` (Express) | `http://localhost:3000` | API REST + SwaggerUI |
| `postgres` | `localhost:5433` | Base de datos (acceso externo) |

El servidor aplica automáticamente el esquema de Prisma y ejecuta el seed (crea el usuario administrador) antes de arrancar.

**4. Acceder a la aplicación**

- Aplicación web: [http://localhost](http://localhost)
- Documentación de la API (SwaggerUI): [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

**5. Parar la aplicación**

```bash
docker compose down          # mantiene los datos
docker compose down -v       # elimina también el volumen de PostgreSQL
```

## Documentación oficial

Toda la documentación del proyecto está recogida en **[`Memoria.pdf`](./Memoria.pdf)**, estructurada en tres partes:

| Parte | Contenido |
|---|---|
| **I — Memoria del Proyecto** | Descripción, objetivos, motivación, entorno tecnológico, arquitectura, conclusiones y líneas de futuro |
| **II — Documentación técnica** | Análisis de actores y casos de uso, requisitos funcionales y no funcionales, modelo relacional, diccionario de datos, diagramas de secuencia, implementación y pruebas de caja negra |
| **III — Manuales** | Manual de instalación y manual de usuario (cliente, empresa gestora y administrador) |

## Endpoints principales de la API

La API REST está documentada al completo con OpenAPI. Los recursos disponibles son:

- `POST /auth/...` — Registro e inicio de sesión (clientes y empresas)
- `GET|POST /enterprise/...` — Gestión de empresas gestoras
- `GET|PATCH /client/...` — Perfil de cliente y recarga de pulsera
- `GET|POST|PATCH /festival/...` — CRUD de festivales y compra de abonos
- `GET|POST /artist/...` — Gestión de artistas
- `GET /logs` — Logs del servidor (solo administrador)

## Licencia

Proyecto académico desarrollado para la asignatura **Plataformas de Software Empresariales** del Grado en Ingeniería Informática de Servicios y Aplicaciones, Universidad de Valladolid.
