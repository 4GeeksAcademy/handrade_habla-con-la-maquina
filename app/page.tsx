"use client";

import { useEffect, useRef, useState } from "react";
import ClearConversation from "@/components/ClearConversation/ClearConversation";
import ChatMessage from "@/components/ChatMessage/ChatMessage";
import Composer from "@/components/Composer/Composer";
import ErrorBanner from "@/components/ErrorBanner/ErrorBanner";
import EmptyState from "@/components/EmptyState/EmptyState";
import MeterPanel from "@/components/MeterPanel/MeterPanel";
import { callGroq, friendlyError, GroqError, type Message } from "@/lib/groq";
import type { SessionStats } from "@/components/MeterPanel/MeterPanel";
import styles from "./page.module.css";

const suggestions = [
  "¿Qué es exactamente un token?",
  "Resume en tres puntos cómo funciona un modelo de lenguaje.",
  "¿Por qué una pregunta larga cuesta más que una corta?",
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "end",
    });
  }, [messages, isLoading, error]);

  const totals = messages.reduce(
    (current, message) => {
      if (message.role !== "assistant" || !message.usage || !message.metrics) {
        return current;
      }

      return {
        promptTokens: current.promptTokens + message.usage.prompt_tokens,
        completionTokens: current.completionTokens + message.usage.completion_tokens,
        totalTokens: current.totalTokens + message.usage.total_tokens,
        latencyTotal: current.latencyTotal + message.metrics.latencyMs,
        tokensPerSecondTotal: current.tokensPerSecondTotal + message.metrics.tokensPerSecond,
        turns: current.turns + 1,
        model: message.metrics.model,
      };
    },
    {
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
      latencyTotal: 0,
      tokensPerSecondTotal: 0,
      turns: 0,
      model: null as string | null,
    },
  );

  const stats: SessionStats = {
    promptTokens: totals.promptTokens,
    completionTokens: totals.completionTokens,
    totalTokens: totals.totalTokens,
    turns: totals.turns,
    avgLatencyMs: totals.turns ? totals.latencyTotal / totals.turns : null,
    avgTokensPerSecond: totals.turns ? totals.tokensPerSecondTotal / totals.turns : null,
    model: totals.model,
  };

  async function handleSend(text = input, appendUserMessage = true) {
    const content = text.trim();
    if (!content || isLoading) {
      return;
    }

    const history = appendUserMessage
      ? [...messages, { role: "user" as const, content }]
      : messages;

    if (appendUserMessage) {
      setMessages(history);
    }
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const requestMessages = history.map(({ role, content: messageContent }) => ({
        role,
        content: messageContent,
      }));
      const response = await callGroq(requestMessages);
      const cleanContent = response.content.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          role: "assistant",
          content: cleanContent,
          usage: response.usage,
          metrics: {
            latencyMs: response.latencyMs,
            tokensPerSecond: response.tokensPerSecond,
            model: response.model,
          },
        },
      ]);
    } catch (caughtError) {
      setError(caughtError instanceof GroqError ? friendlyError(caughtError.status) : friendlyError(null));
    } finally {
      setIsLoading(false);
    }
  }

  function handleRetry() {
    const lastUserMessage = [...messages].reverse().find((message) => message.role === "user");
    if (lastUserMessage) {
      void handleSend(lastUserMessage.content, false);
    }
  }

  function clearConversation() {
    setMessages([]);
    setInput("");
    setError(null);
  }

  return (
    <div className={styles.screen}>
      <main className={styles.chatPane}>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <h1>Habla con la Máquina</h1>
            <ClearConversation
              disabled={messages.length === 0 || isLoading}
              messageCount={messages.length}
              onConfirm={clearConversation}
            />
          </div>
        </header>

        <div className={styles.transcriptViewport}>
          <div className={styles.transcriptInner}>
            {messages.length === 0 ? (
              <EmptyState suggestions={suggestions} onPick={(text) => void handleSend(text)} />
            ) : (
              <ol className={styles.messageList} aria-label="Conversación" aria-live="polite">
                {messages.map((message, index) => (
                  <li key={`${message.role}-${index}`}>
                    <ChatMessage message={message} />
                  </li>
                ))}
                {isLoading && (
                  <li className={styles.thinking} role="status" aria-live="polite">
                    <span className={styles.thinkingDot} aria-hidden="true" />
                    <span>Pensando…</span>
                  </li>
                )}
                {error && (
                  <li>
                    <ErrorBanner message={error} onRetry={handleRetry} />
                  </li>
                )}
              </ol>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        <div className={styles.composerFrame}>
          <Composer
            value={input}
            onChange={setInput}
            disabled={isLoading}
            onSend={() => void handleSend()}
          />
        </div>
      </main>

      <aside className={styles.meterPane}>
        <MeterPanel stats={stats} />
      </aside>
    </div>
  );
}
