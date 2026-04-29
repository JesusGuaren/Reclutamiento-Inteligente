# TesIS-AI: Sistema de Reclutamiento Inteligente (v2.0)

![Versión](https://img.shields.io/badge/Versi%C3%B3n-2.0--Revision-blue)
![Tecnologías](https://img.shields.io/badge/Stack-Next.js%2015%20%7C%20Supabase%20%7C%20Tailwind-green)

Esta es la **Segunda Revisión** del sistema de reclutamiento basado en inteligencia artificial. En esta entrega, el proyecto ha evolucionado de una herramienta administrativa a una plataforma ecosistémica dual que separa la gestión experta del reclutador de la experiencia de postulación del candidato.

## 🚀 Novedades de la Segunda Revisión

- **Arquitectura Dual**: Separación física y lógica de interfaces mediante *Next.js Route Groups* (`(admin)` vs `(portal)`).
- **Portal de Candidatos (Tinder-Style)**: Nueva interfaz pública en `/jobs` donde los candidatos pueden visualizar ofertas y postularse de forma express.
- **Motor de IA Fortificado**: Actualización del sistema de extracción de datos con `unpdf` y `pdfjs-dist`, permitiendo la lectura de CVs con estructuras complejas o errores de formato (XRef fix).
- **Lógica de Evaluación Estricta**: Recalibración del algoritmo de scoring para eliminar inconsistencias y asegurar un análisis 100% determinista basado en evidencia.
- **Módulo de Agenda**: Nueva vista de gestión de entrevistas sincronizada con el estado global de los candidatos.

## 🛠 Estructura del Proyecto

```text
src/
├── app/
│   ├── (admin)/    # Panel de gestión (Dashboard, Pipeline, Agenda)
│   ├── (portal)/   # Interfaz pública para candidatos (/jobs)
│   └── api/        # Motor de extracción de datos (IA)
├── components/     # Componentes compartidos y UI premium
├── lib/            # Lógica central del evaluador y Supabase
└── types/          # Definiciones de TypeScript para el dominio
```

## 📋 Guía Rápida de Uso

1. **Para Candidatos**: Acceda a `/jobs` para explorar las vacantes activas y subir su CV. El sistema analizará su perfil en tiempo real.
2. **Para Reclutadores**: Acceda al `/dashboard` para visualizar métricas, gestionar el pipeline de selección y agendar entrevistas.

---
*Este proyecto forma parte de una investigación de tesis sobre la optimización de procesos de selección mediante algoritmos deterministas.*
