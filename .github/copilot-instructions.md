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