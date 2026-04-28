# 🚀 TesIS-AI: Sistema Inteligente de Reclutamiento

**TesIS-AI** es una plataforma PWA (Progressive Web App) diseñada para optimizar la toma de decisiones en los procesos de selección de talento. Utiliza un motor de evaluación determinista para analizar CVs en formato PDF y compararlos contra perfiles de cargo específicos, eliminando sesgos cognitivos y ahorrando horas de revisión manual.

---

## 🌟 Características Principales

- **Análisis de CVs por IA:** Extracción automática de habilidades, experiencia y educación desde archivos PDF.
- **Scoring Determinista:** Algoritmo basado en reglas que garantiza transparencia y explicabilidad (Habilidades 40%, Experiencia 30%, Educación 20%, Extras 10%).
- **Pipeline Kanban:** Gestión visual de candidatos mediante etapas (Evaluados, Entrevista, Prueba Técnica, etc.).
- **Talent Pool Global:** Base de datos centralizada con búsqueda avanzada por habilidades.
- **Seguridad de Datos:** Aislamiento de información por empresa mediante Row-Level Security (RLS).
- **Reportes:** Exportación de rankings de candidatos en formato CSV para análisis externo.

---

## 🛠️ Manual de Usuario

### 1. Inicio y Autenticación
- **Landing Page:** Al entrar, verás la propuesta de valor del sistema. Haz clic en "Comenzar" para ir al Login.
- **Registro:** Si eres nuevo, regístrate indicando tu nombre y la empresa a la que representas.

### 2. Gestión de Ofertas de Empleo
- Ve a la pestaña **"Ofertas"** y haz clic en **"Nueva Oferta"**.
- Define el título, nivel (Junior, Senior, etc.), experiencia mínima requerida y las habilidades técnicas necesarias.
- Puedes pausar o cerrar ofertas desde el **Dashboard** principal.

### 3. Evaluación de Candidatos
- Dirígete a **"Evaluar"**.
- Selecciona la oferta de empleo para la cual vas a evaluar.
- Sube el archivo CV en formato **PDF**. El sistema procesará el texto y calculará el porcentaje de compatibilidad al instante.

### 4. Gestión del Pipeline (Kanban)
- En la pestaña **"Pipeline"**, verás a tus candidatos organizados por columnas.
- Haz clic en el nombre de un candidato para ver su **Análisis de Brecha (Skill Gap)**. El sistema te marcará en rojo lo que le falta y en verde lo que cumple.
- Cambia la etapa del candidato usando el selector para moverlo a entrevista o contratación.

### 5. Talent Pool y Ranking
- Usa el **"Talent Pool"** para buscar habilidades específicas entre todos los candidatos que ya has evaluado.
- En la pestaña **"Ranking"**, visualiza la lista ordenada por score y descarga el reporte CSV para presentarlo a gerencia.

---

## 🏗️ Arquitectura Técnica

- **Framework:** Next.js 15 (App Router).
- **Estilos:** Tailwind CSS con soporte para modo oscuro.
- **Backend:** Supabase (PostgreSQL + Auth + Storage).
- **Parsing:** Engine de extracción basado en `pdf-parse` con lógica de limpieza determinista.
- **Seguridad:** Middleware de autenticación y políticas RLS en base de datos.

---

## 🚀 Instalación Local

1. Clona el repositorio:
   ```bash
   git clone https://github.com/JesusGuaren/Reclutamiento-Inteligente.git
   ```
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Configura las variables de entorno en un archivo `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key
   ```
4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

---

## 🎓 Contexto Académico
Este proyecto fue desarrollado como parte de la tesis profesional para demostrar la viabilidad de sistemas de apoyo a la decisión en Recursos Humanos, priorizando la **transparencia algorítmica** sobre modelos de caja negra.
