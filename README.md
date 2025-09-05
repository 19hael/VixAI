VixAI acelera la creación de anuncios (copy, variantes, ángulos, CTA) asistidos por IA, ofreciendo una experiencia moderna en frontend y una API backend preparada para producción. Ideal para marketers, agencias y startups que buscan consistencia, velocidad y escalabilidad.

Objetivos
Reducir el tiempo de ideación y producción de anuncios.
Estandarizar la calidad con prompts y plantillas reutilizables.
Facilitar la colaboración y aprobación con vistas de admin.
Medir resultados para mejorar con ciclos rápidos.
Funcionalidades
Registro e inicio de sesión.
Dashboard con resumen de campañas y acceso rápido.
Generador de anuncios con IA (prompts guiados, variantes).
Vista de administración (gestión de usuarios/contenido).
Estructura preparada para analítica y próximos módulos.
Base para despliegue continuo del frontend.
Arquitectura
Frontend:
Aplicación React/TypeScript con páginas como Register, Dashboard, GenerateAd, Admin.
Empaquetada para despliegue estático (ej. Netlify).
Backend:
API Python (estructura modular en app/, core/, models/).
Endpoints para autenticación, generación y gestión (extensible).
Base de datos:
Configurable (ej. PostgreSQL/SQLite). No se fija un motor aquí; ajusta según tu .env.
Autenticación:
Preparada para tokens/headers (detallar implementación concreta en el backend).
Despliegue:
Frontend: Netlify (archivo netlify.toml incluido).
Backend: proveedor a elección (Railway, Render, Fly.io, etc.).
Estructura del repositorio
VixAI-backend/
app/ — lógica de la aplicación backend (routers/controladores).
core/ — configuración, seguridad, utilidades.
models/ — modelos de datos/ORM.
.env.example — variables de entorno de ejemplo.
VixAI-frontend/ — proyecto de frontend (React/TypeScript).
public/ — estáticos públicos.
src/pages/
Register.tsx
Dashboard.tsx
GenerateAd.tsx
Admin.tsx
netlify.toml — configuración de Netlify para el frontend.
Nota: El frontend está anidado dentro de VixAI-backend/ como parte de un monorepo. Puedes separar en el futuro si lo prefieres.

Tecnologías
Frontend:
React + TypeScript.
Librerías UI/estado según necesidad (configurable).
Backend:
Python (p. ej. FastAPI/Starlette/Flask — ajusta según tu implementación exacta).
Infraestructura:
Netlify (frontend).
Proveedor para backend (a elección).
Dev:
Node.js y npm/yarn/pnpm.
Gestor de entornos .env.
Requisitos previos
Node.js y npm (o yarn/pnpm).
Python 3.10+ recomendado.
Git.
Cuenta en Netlify (para despliegue del frontend).
Un proveedor para el backend (Railway/Render/etc.) si quieres producción.
Configuración (local)
Clonar e instalar
Clona el repo.
Instala dependencias del frontend:
cd VixAI-backend/VixAI-frontend
npm install
(Opcional) Crea y activa un entorno virtual para backend e instala dependencias:
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
Nota: Si aún no existe requirements.txt, créalo con tus dependencias reales.

Variables de entorno
Copia .env.example a .env en VixAI-backend/ y completa valores:
cp VixAI-backend/.env.example VixAI-backend/.env
Añade las variables del frontend en VixAI-backend/VixAI-frontend/.env si las necesitas (ver sección Variables de entorno).
Ejecutar en desarrollo
Frontend:
npm run dev
Backend:
python -m app
Ajusta el comando del backend a cómo expongas tu servidor (uvicorn, flask run, etc.).

Variables de entorno
Ajusta estas variables según tu stack real:

Backend (VixAI-backend/.env)

APP_ENV=development
APP_PORT=8000
DATABASE_URL=postgresql://user:pass@host:5432/dbname
SECRET_KEY=tu_clave_segura
AI_PROVIDER=openai (u otro)
AI_API_KEY=sk-...
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
Frontend (VixAI-backend/VixAI-frontend/.env)

VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=VixAI
Ten en cuenta no commitear credenciales reales. Usa .env.example para documentar.

Scripts de desarrollo
Frontend (en VixAI-backend/VixAI-frontend/package.json)

dev — iniciar servidor de desarrollo.
build — compilar producción.
preview — previsualizar build.
Backend

Define scripts según tu framework (por ejemplo FastAPI con uvicorn):
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
Despliegue
Frontend (Netlify)

Asegúrate de tener netlify.toml configurado. Ejemplo típico:
[build]
  command = "npm run build"
  publish = "dist"
En Netlify, crea un sitio desde el repo y define:
Directorio de build: VixAI-backend/VixAI-frontend
Comando de build: npm run build
Directorio de publicación: dist
Configura variables (ej. VITE_API_BASE_URL) en Netlify.
Backend

Elige un proveedor (Railway/Render/Fly.io).
Define variables de entorno de producción.
Expón tu API pública y actualiza VITE_API_BASE_URL en el frontend.
Roadmap
Autenticación robusta con JWT/refresh tokens.
Biblioteca de prompts y plantillas.
Analítica de rendimiento por anuncio/campaña.
Exportación a formatos y plataformas (Meta/Google).
Colaboración en tiempo real.
Moderación de contenido con políticas.
Internacionalización (i18n).
Contribuciones
¡Contribuciones bienvenidas!

Crea un issue describiendo la propuesta o bug.
Fork, crea una rama (feat/tu-feature o fix/tu-fix), haz commit con mensajes claros.
Abre un PR con contexto, screenshots y pasos de prueba.
Guías recomendadas

Estilo de código consistente.
Commits semánticos si es posible.
PRs pequeños y enfocados.
Seguridad
No subas secretos al repo.
Regenera claves en caso de exposición.
Abre un issue privado o contacta al mantenedor para reportes sensibles.
Licencia
Define aquí tu licencia (ej. MIT). Si usas MIT: Este proyecto se distribuye bajo la licencia MIT. Consulta el archivo LICENSE para más detalles.

Contacto
Equipo VixAI
Email: support@vixai.lat
Sitio: vixai.lat
