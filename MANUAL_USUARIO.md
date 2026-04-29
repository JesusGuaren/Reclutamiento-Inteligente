# Manual de Usuario - TesIS-AI (v2.0)

Este documento detalla el funcionamiento de la plataforma para los dos perfiles principales de usuario.

## 1. Perfil del Reclutador (Panel Administrativo)

### 1.1 Acceso y Dashboard
Al iniciar sesión, el reclutador es recibido por el **Dashboard**, donde puede ver:
- El número de ofertas activas.
- Total de candidatos en el sistema.
- Promedio de score de los postulantes actuales.

### 1.2 Gestión de Ofertas
En la sección de **Ofertas**, el reclutador puede crear nuevas vacantes definiendo:
- Título y descripción.
- Habilidades requeridas (usar comas para separar).
- Años de experiencia mínimos.
- **Ponderación**: Definir qué porcentaje de importancia tiene cada área (Habilidades, Experiencia, Educación).

### 1.3 Pipeline de Selección (Kanban)
Vista visual del proceso de selección dividida en columnas:
- **Pendiente**: Nuevas postulaciones que llegan desde el portal.
- **Seleccionado**: Candidatos marcados para avanzar.
- **Entrevista**: Candidatos con fecha programada.
- **Rechazado**: Perfiles que no cumplen con los requisitos.

### 1.4 Agenda
Módulo para visualizar las entrevistas programadas. Permite:
- Ver fecha y hora de la cita.
- Marcar entrevistas como realizadas para actualizar el estado del candidato.

---

## 2. Perfil del Candidato (Portal de Empleo)

### 2.1 Exploración de Vacantes
En la ruta `/jobs`, el candidato encontrará una interfaz estilo "Tinder" o "Cards" con las ofertas activas. Puede navegar entre ellas usando las flechas laterales.

### 2.2 Postulación Inteligente
1. El candidato selecciona una oferta de su interés.
2. Hace clic en **"Postular Ahora"**.
3. Sube su currículum en formato **PDF**.
4. El sistema procesa el documento automáticamente (IA) y crea el perfil del candidato sin necesidad de que este rellene formularios extensos.

---

## 3. Consideraciones Técnicas (Motor de IA)

- **Extracción**: El sistema utiliza el motor de `pdfjs-dist` para leer el contenido de los archivos. Se recomienda subir PDFs basados en texto (no escaneos de imágenes) para una precisión del 100%.
- **Evaluación**: El score se calcula de forma determinista comparando las habilidades y experiencia extraídas contra los requisitos de la oferta y los pesos definidos por el reclutador.
