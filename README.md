# Plataforma-de-Eventos-Universitarios-

> Proyecto full-stack guiado por el docente — Programación Web 2026A

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)

📋 Tabla de Contenidos

- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Stack Tecnológico](#-stack-tecnológico)
- [Arquitectura](#-arquitectura)
- [Modelo de Datos](#-modelo-de-datos)
- [Plan de Releases](#-plan-de-releases)
- [Sprints e Historias de Usuario](#-sprints-e-historias-de-usuario)
- [Cronograma](#-cronograma)
- [Definition of Done (DoD)](#-definition-of-done-dod)
- [Tablero Kanban](#-tablero-kanban)
- [Instalación y Ejecución](#-instalación-y-ejecución)

📖 Descripción del Proyecto
La Plataforma de Eventos Universitarios es una aplicación web full-stack diseñada para gestionar de manera centralizada los eventos académicos, culturales y deportivos de una institución educativa.

El sistema permite a los organizadores crear y administrar eventos, asignar espacios y ponentes, así como a los estudiantes inscribirse, consultar el calendario y recibir información actualizada sobre las actividades disponibles.

Este proyecto surge como solución a problemas comunes en la gestión de eventos universitarios, como la superposición de horarios, la baja difusión de actividades y la dificultad para llevar un control de asistencia.
🎯 Alcance del Proyecto
| Aspecto                  | Detalle                                                                                           |
| ------------------------ | ------------------------------------------------------------------------------------------------- |
| **Tipo de proyecto**     | Proyecto académico demostrativo                                                                   |
| **Entidades**            | 8 entidades: Evento, TipoEvento, Espacio, Ponente, Estudiante, Inscripción, Facultad y Asistencia |
| **Historias de usuario** | 10 historias de usuario                                                                           |
| **Sprints**              | 3 a 5 sprints (metodología ágil)                                                                  |
| **Releases**             | 1 a 2 entregas principales                                                                        |
| **Casos de uso**         | 10 casos de uso                                                                                   |

🧩 Funcionalidades Principales

📅 Registro y gestión de eventos académicos, culturales y deportivos

🏫 Asignación de espacios físicos con validación de disponibilidad

🎤 Registro de ponentes y sus áreas de experticia

👨‍🎓 Inscripción y cancelación de estudiantes en eventos

🔍 Consulta de calendario con filtros (tipo, facultad, fecha)

✅ Control de asistencia a eventos

📊 Generación de reportes de participación

🏛️ Gestión de facultades organizadoras

⏳ Visualización de eventos próximos con cupos disponibles

## 🛠 Stack Tecnológico

| Capa | Tecnología | Propósito |
|---|---|---|
| **Backend** | NestJS (Node.js + TypeScript) | API REST con arquitectura en capas |
| **Frontend** | Next.js 14+ (React + TypeScript) | Interfaz de usuario con App Router |
| **Base de Datos** | PostgreSQL 16 | Almacenamiento relacional |
| **ORM** | Prisma | Modelado de datos, migraciones y queries |
| **Contenedores** | Docker + Docker Compose | Orquestación de servicios |
| **Validación** | class-validator + class-transformer | DTOs y validación de entrada |

🏗️ Arquitectura del Sistema

La Plataforma de Eventos Universitarios está diseñada bajo una arquitectura cliente-servidor con un enfoque en capas, lo que permite una separación clara de responsabilidades, escalabilidad y fácil mantenimiento.
Tecnologías sugeridas:

Node.js + Express

Prisma ORM

### Estructura del Proyecto

```
proyecto/
├── docker-compose.yml
├── .env.example
├── backend/                        # API REST con NestJS
│   ├── Dockerfile
│   ├── src/
│   │   ├── common/                 # Módulo compartido (cross-cutting)
│   │   │   ├── filters/            # Filtros de excepción globales
│   │   │   ├── interceptors/       # Interceptores de respuesta
│   │   │   ├── pipes/              # Pipes de validación
│   │   │   └── guards/             # Guards de autenticación
│   │   ├── prisma/                 # Módulo Prisma (acceso a BD)
│   │   └── modules/                # Módulos de dominio
│   │       └── [entidad]/
│   │           ├── controller/     # Solo manejo HTTP
│   │           ├── service/        # Lógica de negocio
│   │           ├── repository/     # Acceso a datos (Prisma)
│   │           ├── dto/            # Validación de entrada
│   │           └── entities/       # Representación del dominio
│   └── prisma/
│       ├── schema.prisma
│       └── migrations/
│
├── frontend/                       # Interfaz con Next.js
│   ├── Dockerfile
│   ├── src/
│   │   ├── app/                    # App Router (páginas)
│   │   ├── components/             # Componentes reutilizables
│   │   ├── services/               # Capa de acceso a la API
│   │   ├── interfaces/             # Tipos e interfaces TypeScript
│   │   └── lib/                    # Utilidades
│   └── package.json
│
└── README.md
```

📊 Modelo de Datos
🔗 Diagrama de Relaciones

Evento 1 ──── N Inscripcion
Estudiante 1 ──── N Inscripcion
Inscripcion 1 ──── 1 Asistencia
TipoEvento 1 ──── N Evento
Espacio 1 ──── N Evento
Facultad 1 ──── N Evento
Evento N ──── N Ponente

📊 Entidades

🧩 Evento
| Campo        | Tipo   | Descripción             |
| ------------ | ------ | ----------------------- |
| id           | int    | Identificador único     |
| titulo       | string | Nombre del evento       |
| descripcion  | string | Detalle del evento      |
| fecha        | date   | Fecha de realización    |
| aforo_maximo | int    | Capacidad máxima        |
| tipoEventoId | int    | Relación con TipoEvento |
| espacioId    | int    | Relación con Espacio    |
| facultadId   | int    | Relación con Facultad   |

🧩 TipoEvento
| Campo  | Tipo   | Descripción                      |
| ------ | ------ | -------------------------------- |
| id     | int    | Identificador único              |
| nombre | string | Tipo (conferencia, taller, etc.) |

🧩 Espacio
| Campo     | Tipo   | Descripción         |
| --------- | ------ | ------------------- |
| id        | int    | Identificador único |
| nombre    | string | Nombre del espacio  |
| capacidad | int    | Capacidad del lugar |

🧩 Ponente
| Campo        | Tipo   | Descripción          |
| ------------ | ------ | -------------------- |
| id           | int    | Identificador único  |
| nombre       | string | Nombre del ponente   |
| especialidad | string | Área de conocimiento |

🧩 Estudiante
| Campo  | Tipo   | Descripción           |
| ------ | ------ | --------------------- |
| id     | int    | Identificador único   |
| nombre | string | Nombre del estudiante |
| email  | string | Correo electrónico    |

🧩 Inscripción
| Campo             | Tipo | Descripción             |
| ----------------- | ---- | ----------------------- |
| id                | int  | Identificador único     |
| estudianteId      | int  | Relación con Estudiante |
| eventoId          | int  | Relación con Evento     |
| fecha_inscripcion | date | Fecha de registro       |

🧩 Facultad
| Campo  | Tipo   | Descripción           |
| ------ | ------ | --------------------- |
| id     | int    | Identificador único   |
| nombre | string | Nombre de la facultad |

🧩 Asistencia
| Campo         | Tipo    | Descripción              |
| ------------- | ------- | ------------------------ |
| id            | int     | Identificador único      |
| inscripcionId | int     | Relación con Inscripción |
| asistio       | boolean | Indica si asistió        |

🚀 Plan de Releases
Release 1 — Segundo Corte: Backend + Frontend Base

📅 Cierre: 17 de Abril de 2026 · Sprints 1, 2 y 3

Objetivo: Entregar la API REST completa con arquitectura en capas (Controller → Service → Repository) y el frontend con las vistas de CRUD para todas las entidades base y funcionalidades principales de inscripción y asistencia.
| Sprint                                                             | Período         | HUs                        | Alcance                                                                                                   |
| ------------------------------------------------------------------ | --------------- | -------------------------- | --------------------------------------------------------------------------------------------------------- |
| [Sprint 1 — Infraestructura y entidades base](#sprint-1)           | Mar 16 → Mar 29 | HU-01, HU-02, HU-03        | Docker, Prisma, Evento, TipoEvento, Espacio, Facultad                                                     |
| [Sprint 2 — Gestión de usuarios y ponentes](#sprint-2)             | Mar 30 → Abr 10 | HU-04, HU-05, HU-08        | Estudiante, Ponente, Inscripción, Gestión de facultades                                                   |
| [Sprint 3 — Funcionalidades de asistencia y calendario](#sprint-3) | Abr 13 → Abr 17 | HU-06, HU-07, HU-09, HU-10 | Registro de asistencia, Consulta de calendario, Visualización de eventos próximos, Reportes de asistencia |

🚀 Release 2 — Tercer Corte: Integración + Reportes Avanzados

📅 Cierre: 22 de Mayo de 2026 · Sprints 4 y 5

Objetivo: Integración completa frontend ↔ backend, flujos completos de inscripción → asistencia → reportes, generación de estadísticas y notificaciones. Despliegue funcional con Docker.

| Sprint                                                   | Período         | HUs                        | Alcance                                                                                                                                                                                             |
| -------------------------------------------------------- | --------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Sprint 4 — Frontend avanzado e integración](#sprint-4)  | Abr 20 → May 8  | HU-04, HU-05, HU-07, HU-10 | Mejoras en inscripción y cancelación, registro de asistencia avanzado, integración con backend, navegación completa y layout del frontend                                                           |
| [Sprint 5 — Reportes, visualización y cierre](#sprint-5) | May 11 → May 22 | HU-06, HU-09               | Calendario interactivo de eventos, filtros avanzados, visualización de eventos próximos, generación de reportes de asistencia y estadísticas, pruebas E2E, notificaciones y cierre de entrega final |

📌 Sprints e Historias de Usuario
Sprint 1 — Infraestructura y entidades base

📅 Mar 16 → Mar 29 · 🚫 Festivo: Mar 23 (San José) · Ver Milestone
| #     | Historia de Usuario      | Labels                            | Issue   |
| ----- | ------------------------ | --------------------------------- | ------- |
| HU-01 | Registrar evento         | `user-story` `backend` `frontend` | [#1](#) |
| HU-02 | Asignar espacio a evento | `user-story` `backend` `frontend` | [#2](#) |
| HU-03 | Registrar ponentes       | `user-story` `backend` `frontend` | [#3](#) |

Sprint 2 — Gestión de usuarios y facultades

📅 Mar 30 → Abr 10 · Ver Milestone
| #     | Historia de Usuario  | Labels                            | Issue   |
| ----- | -------------------- | --------------------------------- | ------- |
| HU-04 | Inscribirse a evento | `user-story` `backend` `frontend` | [#4](#) |
| HU-05 | Cancelar inscripción | `user-story` `backend` `frontend` | [#5](#) |
| HU-08 | Gestionar facultades | `user-story` `backend` `frontend` | [#6](#) |

Sprint 3 — Funcionalidades de asistencia y calendario
📅 Abr 13 → Abr 17 · Ver Milestone
| #     | Historia de Usuario             | Labels                            | Issue    |
| ----- | ------------------------------- | --------------------------------- | -------- |
| HU-06 | Consultar calendario de eventos | `user-story` `frontend`           | [#7](#)  |
| HU-07 | Registrar asistencia            | `user-story` `backend` `frontend` | [#8](#)  |
| HU-09 | Ver eventos próximos            | `user-story` `frontend`           | [#9](#)  |
| HU-10 | Generar reporte de asistencia   | `user-story` `backend` `frontend` | [#10](#) |

📅 Cronograma
