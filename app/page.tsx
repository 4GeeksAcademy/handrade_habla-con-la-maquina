"use client";

import { useState } from "react";
import Link from "next/link";
import ChatMessage from "@/components/ChatMessage/ChatMessage";
import Composer from "@/components/Composer/Composer";
import EmptyState from "@/components/EmptyState/EmptyState";
import MeterPanel from "@/components/MeterPanel/MeterPanel";
import type { Message, Usage } from "@/lib/groq";
import styles from "./page.module.css";

const exampleModel = "qwen/qwen3.6-27b";

// La conversación y sus métricas son datos de muestra; no se llama a la API.
const exampleMessages: Message[] = [
  {
    role: "user",
    content: "¿Cómo empiezo una conversación que dé respuestas más útiles?",
  },
  {
    role: "assistant",
    content:
      "Empieza por decir qué quieres conseguir y añade el contexto que cambiaría la respuesta. Si tienes un formato en mente, pídelo desde el inicio: una lista, una explicación breve o un ejemplo concreto.",
    usage: { prompt_tokens: 28, completion_tokens: 43, total_tokens: 71 },
    metrics: { latencyMs: 940, tokensPerSecond: 45.74 },
  },
  {
    role: "user",
    content: "¿Y si todavía no sé exactamente qué necesito?",
  },
  {
    role: "assistant",
    content:
      "Puedes empezar con lo que sí sabes y mencionar qué parte está poco clara. Una buena conversación se construye por etapas: explora opciones, elige una dirección y luego profundiza en los detalles.",
    usage: { prompt_tokens: 36, completion_tokens: 47, total_tokens: 83 },
    metrics: { latencyMs: 1080, tokensPerSecond: 43.52 },
  },
];

const starterPrompts = [
  "Ayúdame a ordenar una idea que tengo",
  "Explícame un concepto con un ejemplo",
  "Dame otra perspectiva sobre un problema",
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>(exampleMessages);

  const usage = messages.reduce<Usage>(
    (total, message) => ({
      prompt_tokens: total.prompt_tokens + (message.usage?.prompt_tokens ?? 0),
      completion_tokens: total.completion_tokens + (message.usage?.completion_tokens ?? 0),
      total_tokens: total.total_tokens + (message.usage?.total_tokens ?? 0),
    }),
    { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
  );

  const latencyMs = messages.reduce(
    (total, message) => total + (message.metrics?.latencyMs ?? 0),
    0,
  );
  const tokensPerSecond =
    latencyMs > 0 ? usage.completion_tokens / (latencyMs / 1000) : 0;

  function addUserMessage(content: string) {
    setMessages((currentMessages) => [...currentMessages, { role: "user", content }]);
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.topbar}>
          <Link className={styles.brand} href="/" aria-label="Habla con la Máquina, inicio">
            <span className={styles.brandMark} aria-hidden="true">
              H.
            </span>
            <span>
              Habla con <strong>la Máquina</strong>
            </span>
          </Link>
          <span className={styles.modeLabel}>Sesión de ejemplo</span>
        </header>

        <div className={styles.layout}>
          <section className={styles.chat} aria-labelledby="chat-title">
            <header className={styles.chatHeader}>
              <div>
                <p className={styles.eyebrow}>CONVERSACIÓN · 01</p>
                <h1 id="chat-title">Un espacio para pensar en voz alta.</h1>
              </div>
              <button
                className={styles.resetButton}
                type="button"
                onClick={() => setMessages([])}
                disabled={messages.length === 0}
              >
                Nueva sesión
              </button>
            </header>

            {messages.length > 0 ? (
              <div className={styles.transcript} role="log" aria-live="polite" aria-relevant="additions">
                {messages.map((message, index) => (
                  <ChatMessage key={`${message.role}-${index}`} message={message} />
                ))}
              </div>
            ) : (
              <div className={styles.emptyArea}>
                <EmptyState prompts={starterPrompts} onSelectPrompt={addUserMessage} />
              </div>
            )}

            <div className={styles.composerArea}>
              <Composer onSubmit={addUserMessage} />
              <p className={styles.disclaimer}>Las respuestas y métricas visibles son de ejemplo.</p>
            </div>
          </section>

          <aside className={styles.meterAside} aria-label="Métricas de la sesión">
            <MeterPanel
              usage={usage}
              model={exampleModel}
              latencyMs={latencyMs}
              tokensPerSecond={tokensPerSecond}
            />
          </aside>
        </div>

        <footer className={styles.footer}>
          <span>HABLA CON LA MÁQUINA</span>
          <span>PROTOTIPO · DATOS LOCALES</span>
        </footer>
      </div>
    </main>
  );
}
