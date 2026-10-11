# Habla con la Máquina

## Descripción

Prototipo de aprendizaje para crear un chat conectado a la API de Groq. La lógica del chat está pendiente.

## Demo/Capturas

Pendiente.

## Tecnologías

- Next.js con App Router
- TypeScript y React
- API compatible con OpenAI de Groq

## Requisitos

- Node.js 20.9 o posterior
- npm
- Una clave de API de Groq

## Instalación y configuración (.env)

1. Instala las dependencias con `npm install`.
2. Copia `.env.example` a `.env.local`.
3. Añade tu clave de Groq y el modelo en `.env.local`.
4. Inicia el proyecto con `npm run dev`.

`.env.local` está excluido de Git. Las variables `NEXT_PUBLIC_*` quedan disponibles en el navegador; no uses aquí una clave con permisos o datos sensibles.

## Cómo funciona (flujo de datos)

Pendiente. El flujo previsto enviará el historial completo de mensajes a Groq y recibirá la respuesta del modelo.

## Métricas de tokens

Pendiente. Se acumularán los tokens de entrada, salida y total informados por la API.

## Persistencia

Pendiente. El historial se guardará en `localStorage`.

## Limitaciones conocidas

- La interfaz y la lógica de chat todavía no están implementadas.
- Una clave `NEXT_PUBLIC_*` se expone al cliente; este enfoque es solo para el prototipo.

## Estructura del proyecto

```text
app/                        Rutas y estilos de Next.js
docs/                       Decisiones técnicas
public/                     Archivos estáticos
.env.example                Variables de entorno de ejemplo
.github/copilot-instructions.md  Reglas de desarrollo del proyecto
```
