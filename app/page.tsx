"use client";

import { useEffect, useRef, useState } from "react";
import ClearConversation from "@/components/ClearConversation/ClearConversation";
import ChatMessage from "@/components/ChatMessage/ChatMessage";
import Composer from "@/components/Composer/Composer";
import ErrorBanner from "@/components/ErrorBanner/ErrorBanner";
import EmptyState from "@/components/EmptyState/EmptyState";
import MeterPanel from "@/components/MeterPanel/MeterPanel";
import type { Message } from "@/lib/groq";
import type { SessionStats } from "@/components/MeterPanel/MeterPanel";
import styles from "./page.module.css";

type Status = "idle" | "thinking" | "error";

const modelName = "qwen/qwen3.6-27b";

const exampleMessages: Message[] = [
  {
    role: "user",
    content: "¿Qué es exactamente un token?",
  },
  {
    role: "assistant",
    content:
      "Un token es el fragmento mínimo de texto con el que trabaja el modelo. No coincide con una palabra: puede ser una palabra corta entera, un trozo de una palabra larga o un signo de puntuación.\n\nComo referencia, en español un token equivale de media a unos cuatro caracteres. Por eso «máquina» puede ocupar dos tokens y «sol», solo uno.",
    usage: { prompt_tokens: 38, completion_tokens: 92, total_tokens: 130 },
    metrics: { latencyMs: 1180, tokensPerSecond: 77.97 },
  },
  {
    role: "user",
    content: "¿Y por qué importa cuántos tokens uso?",
  },
  {
    role: "assistant",
    content:
      "Por tres razones prácticas. Primero, el coste: los proveedores cobran por token de entrada y de salida. Segundo, la velocidad: cuantos más tokens genera el modelo, más tarda en responder. Tercero, el límite de contexto: cada conversación tiene un máximo, y todo el historial cuenta en cada nueva petición.\n\nFíjate en el medidor: los tokens de prompt crecen en cada turno porque el modelo vuelve a leer la conversación completa.",
    usage: { prompt_tokens: 156, completion_tokens: 118, total_tokens: 274 },
    metrics: { latencyMs: 1540, tokensPerSecond: 76.62 },
  },
];

const suggestions = [
  "¿Qué es exactamente un token?",
  "Resume en tres puntos cómo funciona un modelo de lenguaje.",
  "¿Por qué una pregunta larga cuesta más que una corta?",
];

const cannedReplies = [
  "Buena pregunta. La respuesta corta es que el modelo no lee letras ni palabras, sino secuencias de tokens, y predice el siguiente token más probable a partir de todos los anteriores.\n\nCada vez que respondo, repito ese proceso cientos de veces: un token, luego otro, hasta formar el texto completo.",
  "Te lo resumo en tres puntos: el texto se divide en tokens; el modelo convierte cada token en números que capturan su significado; y a partir de esos números calcula, paso a paso, qué token debería venir después.",
  "Porque todo lo que envías se convierte en tokens de prompt, y el modelo tiene que procesarlos antes de empezar a escribir. Una pregunta más larga significa más tokens de entrada, más tiempo de cálculo y un coste mayor.",
];

function estimateTokens(text: string) {
  const trimmed = text.trim();
  return trimmed ? Math.max(1, Math.round(trimmed.length / 4)) : 0;
}

function buildReply(history: Message[]): Message {
  const lastUserMessage = [...history].reverse().find((message) => message.role === "user");
  const suggestionIndex = suggestions.indexOf(lastUserMessage?.content ?? "");
  const replyIndex = suggestionIndex >= 0 ? suggestionIndex : history.length % cannedReplies.length;
  const content = cannedReplies[replyIndex];
  const promptTokens = 24 + history.reduce((total, message) => total + estimateTokens(message.content), 0);
  const completionTokens = estimateTokens(content);
  const latencyMs = completionTokens * 10 + 220;

  return {
    role: "assistant",
    content,
    usage: {
      prompt_tokens: promptTokens,
      completion_tokens: completionTokens,
      total_tokens: promptTokens + completionTokens,
    },
    metrics: {
      latencyMs,
      tokensPerSecond: completionTokens / (latencyMs / 1000),
    },
  };
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>(exampleMessages);
  const [status, setStatus] = useState<Status>("idle");
  const [simulateError, setSimulateError] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(
    () => () => {
      if (timer.current !== null) {
        clearTimeout(timer.current);
      }
    },
    [],
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "end",
    });
  }, [messages, status]);

  const measuredReplies = messages.flatMap((message) =>
    message.role === "assistant" && message.usage && message.metrics
      ? [{ usage: message.usage, metrics: message.metrics }]
      : [],
  );
  const turns = measuredReplies.length;
  const stats: SessionStats = {
    promptTokens: measuredReplies.reduce((total, reply) => total + reply.usage.prompt_tokens, 0),
    completionTokens: measuredReplies.reduce(
      (total, reply) => total + reply.usage.completion_tokens,
      0,
    ),
    turns,
    avgLatencyMs: turns
      ? measuredReplies.reduce((total, reply) => total + reply.metrics.latencyMs, 0) / turns
      : null,
    avgTokensPerSecond: turns
      ? measuredReplies.reduce((total, reply) => total + reply.metrics.tokensPerSecond, 0) / turns
      : null,
  };

  function requestReply(history: Message[]) {
    if (timer.current !== null) {
      clearTimeout(timer.current);
    }

    const shouldFail = simulateError;
    setStatus("thinking");
    timer.current = setTimeout(() => {
      if (shouldFail) {
        setSimulateError(false);
        setStatus("error");
        return;
      }

      setMessages((currentMessages) => [...currentMessages, buildReply(history)]);
      setStatus("idle");
    }, 1600);
  }

  function send(text: string) {
    const nextMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    requestReply(nextMessages);
  }

  function clearConversation() {
    if (timer.current !== null) {
      clearTimeout(timer.current);
      timer.current = null;
    }

    setMessages([]);
    setStatus("idle");
    setSimulateError(false);
  }

  const isEmpty = messages.length === 0;

  return (
    <div className={styles.screen}>
      <main className={styles.chatPane}>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <h1>Habla con la Máquina</h1>
            <ClearConversation
              disabled={isEmpty || status === "thinking"}
              messageCount={messages.length}
              onConfirm={clearConversation}
            />
          </div>
        </header>

        <div className={styles.transcriptViewport}>
          <div className={styles.transcriptInner}>
            {isEmpty && status === "idle" ? (
              <EmptyState suggestions={suggestions} onPick={send} />
            ) : (
              <ol className={styles.messageList} aria-label="Conversación" aria-live="polite">
                {messages.map((message, index) => (
                  <li key={`${message.role}-${index}`}>
                    <ChatMessage message={message} />
                  </li>
                ))}
                {status === "thinking" && (
                  <li className={styles.thinking} role="status" aria-live="polite">
                    <span className={styles.thinkingDot} aria-hidden="true" />
                    <span>Pensando…</span>
                  </li>
                )}
                {status === "error" && (
                  <li>
                    <ErrorBanner onRetry={() => requestReply(messages)} />
                  </li>
                )}
              </ol>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        <div className={styles.composerFrame}>
          <Composer disabled={status === "thinking"} onSend={send} />
        </div>
      </main>

      <aside className={styles.meterPane}>
        <MeterPanel
          stats={stats}
          model={modelName}
          simulateError={simulateError}
          onToggleError={setSimulateError}
        />
      </aside>
    </div>
  );
}
