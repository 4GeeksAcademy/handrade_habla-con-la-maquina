export interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export interface MessageMetrics {
  latencyMs: number;
  tokensPerSecond: number;
  model: string;
}

export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
  usage?: Usage;
  metrics?: MessageMetrics;
}

export interface GroqResult extends MessageMetrics {
  content: string;
  usage: Usage;
  model: string;
}

interface GroqResponse {
  choices: { message: { content: string } }[];
  usage: Usage;
  model: string;
}

export class GroqError extends Error {
  constructor(
    message: string,
    public readonly status: number | null,
  ) {
    super(message);
    this.name = "GroqError";
  }
}

export function friendlyError(status: number | null): string {
  if (status === null) {
    return "No se pudo conectar con Groq. Comprueba tu conexión e inténtalo de nuevo.";
  }

  if (status === 401) {
    return "La clave de API de Groq no es válida. Revísala e inténtalo de nuevo.";
  }

  if (status === 429) {
    return "Se alcanzó el límite de uso de Groq. Espera un momento e inténtalo de nuevo.";
  }

  if (status >= 500 && status < 600) {
    return "El servicio de Groq no está disponible ahora. Inténtalo de nuevo más tarde.";
  }

  return "Groq no pudo completar la solicitud. Revisa la configuración e inténtalo de nuevo.";
}

export async function callGroq(messages: Message[]): Promise<GroqResult> {
  const startedAt = performance.now();
  let response: Response;

  try {
    response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.NEXT_PUBLIC_GROQ_MODEL,
        // Groq recibe los mensajes, no las métricas internas de la interfaz.
        messages: messages.map(({ role, content }) => ({ role, content })),
      }),
    });
  } catch {
    throw new GroqError(friendlyError(null), null);
  }

  if (!response.ok) {
    throw new GroqError(friendlyError(response.status), response.status);
  }

  let data: GroqResponse;
  try {
    data = (await response.json()) as GroqResponse;
  } catch {
    throw new GroqError("No se pudo interpretar la respuesta de Groq.", response.status);
  }

  const content = data.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !data.usage || typeof data.model !== "string") {
    throw new GroqError("Groq devolvió una respuesta incompleta.", response.status);
  }

  const latencyMs = performance.now() - startedAt;
  const tokensPerSecond =
    latencyMs > 0 ? data.usage.completion_tokens / (latencyMs / 1000) : 0;

  return {
    content,
    usage: data.usage,
    model: data.model,
    latencyMs,
    tokensPerSecond,
  };
}