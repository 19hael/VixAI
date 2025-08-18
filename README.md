# VixAI

Explora las bases y maravillas de la IA en una experiencia web elegante, responsiva y accesible. Incluye registro/inicio de sesión simulado, módulos con progreso, modal de ayuda, confeti de celebración, enlaces sociales y sección legal.

## Características

- Autenticación UI con pestañas: registro e inicio de sesión ([index.html](cci:7://file:///c:/Users/Hael/Desktop/Proyectos%20VSCODE/ACTIVOS/VixAI/index.html:0:0-0:0), [styles.css](cci:7://file:///c:/Users/Hael/Desktop/Proyectos%20VSCODE/ACTIVOS/VixAI/styles.css:0:0-0:0), `app.js`).
- Indicador de progreso con barra animada.
- Grid de módulos responsivo.
- Modal de contenido con pestañas internas y quiz básico.
- Efectos visuales modernos: fondo con blobs, grain, glassmorphism y confeti.
- Footer con acceso a ayuda.
- Botonera fija de redes sociales (X/Twitter e Instagram) abajo a la izquierda.
- Sección legal con copyright y crédito de autor.
- Totalmente responsivo: móvil, tablet y desktop, con soporte para áreas seguras (notch).

## Estructura del proyecto

- [index.html](cci:7://file:///c:/Users/Hael/Desktop/Proyectos%20VSCODE/ACTIVOS/VixAI/index.html:0:0-0:0): estructura principal de la UI, modales, footer, sección legal y enlaces sociales.
- [styles.css](cci:7://file:///c:/Users/Hael/Desktop/Proyectos%20VSCODE/ACTIVOS/VixAI/styles.css:0:0-0:0): estilos globales, glassmorphism, animaciones, responsive y safe-area.
- `app.js`: lógica de tabs, formularios, modales, progreso y efectos (como confeti).

## Tecnologías

- HTML5
- CSS3 (animaciones, filtros, grid/flex, safe-area)
- JavaScript (vanilla)

## Responsive y Accesibilidad

- Breakpoints para móvil (≤600px), tablet (600–900px) y medianas (900–1200px).
- Safe area: `env(safe-area-inset-bottom)` aplicado a `footer`, `.social`, `.modules` y `.legal`.
- Objetivos táctiles mínimos de 44px en botones, enlaces del footer e iconos sociales.
- `aria-label` en iconos y enlaces sociales; `rel="noopener noreferrer"` en enlaces externos.

## Enlaces sociales

- X (Twitter): https://x.com/lostqix
- Instagram: https://instagram.com/lqstza

## Sección legal

- “Todos los derechos reservados © 2025 — VixAI”
- “Desarrollado por Lost”

## Cómo ejecutar localmente

1. Clona el repositorio.
2. Abre [index.html](cci:7://file:///c:/Users/Hael/Desktop/Proyectos%20VSCODE/ACTIVOS/VixAI/index.html:0:0-0:0) directamente en tu navegador, o
3. Usa una extensión tipo “Live Server” para auto-recarga.
   - En VS Code: clic derecho sobre [index.html](cci:7://file:///c:/Users/Hael/Desktop/Proyectos%20VSCODE/ACTIVOS/VixAI/index.html:0:0-0:0) → “Open with Live Server”.

No se requieren dependencias ni build.

## Despliegue (GitHub Pages)

1. En GitHub, ve a Settings → Pages.
2. Source: selecciona `main` (o la rama que uses) y carpeta `/root`.
3. Guarda. La página quedará disponible con la URL de GitHub Pages.

## Personalización rápida

- Colores y estilo: editar en [styles.css](cci:7://file:///c:/Users/Hael/Desktop/Proyectos%20VSCODE/ACTIVOS/VixAI/styles.css:0:0-0:0) (gradientes, blur, radios, etc.).
- Módulos y contenido del modal: actualizar HTML en [index.html](cci:7://file:///c:/Users/Hael/Desktop/Proyectos%20VSCODE/ACTIVOS/VixAI/index.html:0:0-0:0) y lógica en `app.js`.
- Enlaces sociales: modificar URLs en la sección `.social` de [index.html](cci:7://file:///c:/Users/Hael/Desktop/Proyectos%20VSCODE/ACTIVOS/VixAI/index.html:0:0-0:0).
- Textos de ayuda/FAQ: sección `#helpView` en [index.html](cci:7://file:///c:/Users/Hael/Desktop/Proyectos%20VSCODE/ACTIVOS/VixAI/index.html:0:0-0:0).

## Roadmap

- Integrar autenticación real (API/Backend).
- Persistir progreso por usuario (LocalStorage/Backend).
- Más módulos y evaluaciones.
- Tema claro/oscuro con toggle.
- Tests básicos de UI.

## Contribuir

1. Haz un fork del proyecto.
2. Crea una rama (`feat/mi-mejora`).
3. Abre un Pull Request con descripción clara.

## Licencia

Este proyecto se distribuye con todos los derechos reservados. Para usos distintos, solicita autorización al autor.
