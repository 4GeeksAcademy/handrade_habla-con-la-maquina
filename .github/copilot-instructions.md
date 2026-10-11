# Instrucciones del proyecto

- Llama a Groq únicamente con `fetch`; no uses SDK de terceros ni Axios.
- Usa el endpoint `https://api.groq.com/openai/v1/chat/completions`.
- Incluye en cada petición las cabeceras `Authorization: Bearer <clave>` y `Content-Type: application/json`.
- Envía siempre el historial completo de mensajes en cada llamada.
- Usa `async/await` con `try/catch`; muestra los errores de respuestas no-2xx en lenguaje claro.
- Gestiona el estado con `useState` y la persistencia con `useEffect` y `localStorage`.
- Acumula `usage.prompt_tokens`, `usage.completion_tokens` y `usage.total_tokens`.
- Nunca escribas la clave de API en el código ni la incluyas en commits.
- Escribe los comentarios en español y mantén el código simple y legible para principiantes.

## Sistema de diseño

- Define en `:root` de `app/globals.css` estos tokens: `--papel: #F3F5F8`, `--tinta: #151A22`, `--ultramarino: #2A3AF5`, `--ambar: #F5A524`, `--niebla: #DDE2EA` y `--error: #C0392B`.
- Usa `next/font/google` con Bricolage Grotesque para títulos y cifras grandes, y Geist para la interfaz. Las cifras usan `font-variant-numeric: tabular-nums`.
- Muestra las respuestas de la IA como texto sin burbuja. Presenta los mensajes del usuario en un bloque ultramarino con texto claro y una línea discreta de métricas bajo cada respuesta.
- En escritorio, organiza el layout en dos columnas: chat y panel sticky «Medidor de sesión». En móvil, el panel es una barra plegable arriba. Limita el ancho de lectura a aproximadamente `68ch`.
- Garantiza foco visible, contraste AA, `aria-live` en la lista de mensajes y respeto a `prefers-reduced-motion`.
- Usa solo CSS Modules o CSS global; no añadas librerías de UI ni de animación.