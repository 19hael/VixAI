<p align="center">
<img src="https://vixai.lat/logo.png" alt="VixAI Logo" width="150" />
</p>
<h1 align="center">VixAI - Acelera tu Creación de Anuncios con IA 🚀</h1>
<p align="center">
<i>Crea copys, variantes, ángulos y CTAs para tus anuncios de manera rápida y escalable.</i>
</p>

<p align="center">
<img src="https://img.shields.io/badge/Frontend-React%20%26%20TypeScript-blue?style=for-the-badge&logo=react&logoColor=white" alt="React & TypeScript" />
<img src="https://img.shields.io/badge/Backend-Python-yellow?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
<img src="https://img.shields.io/badge/API-FastAPI-green?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
<img src="https://img.shields.io/badge/Base%20de%20Datos-PostgreSQL-red?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
<img src="https://img.shields.io/badge/Despliegue-Netlify%20%26%20Railway-purple?style=for-the-badge&logo=netlify&logoColor=white" alt="Netlify & Railway" />
</p>

💡 Descripción del Proyecto
VixAI es una herramienta asistida por inteligencia artificial diseñada para acelerar la creación de anuncios digitales. Con una interfaz de usuario moderna en el frontend y una API robusta en el backend, VixAI permite a marketers, agencias y startups mantener la consistencia, velocidad y escalabilidad en sus campañas.

🎯 Objetivos Principales
Reducir el tiempo de ideación y producción de anuncios.

Estandarizar la calidad con prompts y plantillas reutilizables.

Facilitar la colaboración con vistas de administración dedicadas.

Medir resultados para optimizar con ciclos de mejora continua.

⚙️ Funcionalidades Clave
Registro e Inicio de Sesión: Autenticación de usuarios segura.

Dashboard Personalizado: Resumen de campañas y acceso rápido a herramientas.

Generador de Anuncios con IA: Asistencia para crear copy, variantes y CTAs.

Vista de Administración: Gestión centralizada de usuarios y contenido.

Estructura Extensible: Base preparada para analítica y futuros módulos.

🏗️ Arquitectura del Sistema
El proyecto sigue un enfoque de monorepo, con la lógica del frontend y el backend anidados en un solo repositorio.

Frontend
Tecnología: React y TypeScript.

Páginas: Register, Dashboard, GenerateAd, Admin.

Despliegue: Empaquetado para despliegue estático, ideal para servicios como Netlify.

Backend
Tecnología: Python (compatible con frameworks como FastAPI, Starlette, Flask).

Estructura: Modular y organizada (app/, core/, models/).

Despliegue: Listo para proveedores como Railway, Render o Fly.io.

Base de Datos & Autenticación
Base de Datos: Configurable (ej. PostgreSQL/SQLite).

Autenticación: Basada en tokens/headers, garantizando seguridad en las peticiones.

🚀 Guía de Configuración Local
Requisitos Previos
Asegúrate de tener instalados los siguientes componentes en tu sistema:

Node.js y npm (o yarn/pnpm)

Python 3.10+

Git

💻 Pasos para la Instalación
Clonar el repositorio:

Bash

git clone https://github.com/tu-usuario/VixAI.git
cd VixAI
Instalar dependencias del Frontend:

Bash

cd VixAI-frontend
npm install
Configurar el Backend (opcional):

Crea un entorno virtual y actívalo:

Bash

python -m venv .venv
source .venv/bin/activate  # En Windows: .venv\Scripts\activate
Instala las dependencias de Python (si tienes un requirements.txt):

Bash

pip install -r requirements.txt
🔑 Variables de Entorno
Copia los archivos de ejemplo para tu configuración:

Bash

cp VixAI-backend/.env.example VixAI-backend/.env
cp VixAI-frontend/.env.example VixAI-frontend/.env
Edita los archivos .env con tus valores reales (API keys, URLs, etc.). ¡Recuerda no subir credenciales reales a tu repositorio!

🏃‍♂️ Ejecutar en Desarrollo
Frontend:

Bash

cd VixAI-frontend
npm run dev
Backend:

Ajusta el comando según el framework que uses (ej. para FastAPI):

Bash

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
🗺️ Roadmap de Características
Autenticación mejorada: Implementación de JWT y refresh tokens.

Biblioteca de prompts: Colección curada de plantillas para anuncios.

Analítica detallada: Medición del rendimiento por anuncio y campaña.

Integraciones: Exportación de anuncios a plataformas como Meta y Google.

Colaboración en tiempo real: Edición y comentarios simultáneos.

🤝 Contribuciones
¡Las contribuciones son bienvenidas! Sigue estos pasos:

Abre un issue para describir la funcionalidad o el bug.

Haz un fork, crea una nueva rama y realiza tus cambios.

Abre un Pull Request (PR) con una descripción clara de tus aportes.

🔒 Seguridad y Licencia
Seguridad: No subas secretos o credenciales directamente al código.

Licencia: Este proyecto se distribuye bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.

📧 Contacto
Para cualquier pregunta o soporte, puedes contactar al equipo de VixAI en:

Email: support@vixai.lat

Sitio Web: vixai.lat
