"use client";

import { useState } from "react";
import { callGroq, friendlyError, GroqError, type GroqResult } from "@/lib/groq";

export default function PruebaPage() {
  const [result, setResult] = useState<GroqResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function testConnection() {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Esta página envía un mensaje para comprobar la conexión.
      const response = await callGroq([{ role: "user", content: "Responde solo: OK" }]);
      setResult(response);
    } catch (caughtError) {
      setError(caughtError instanceof GroqError ? caughtError.message : friendlyError(null));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main>
      <h1>Prueba de conexión con Groq</h1>
      <button type="button" onClick={testConnection} disabled={isLoading}>
        {isLoading ? "Probando conexión..." : "Probar conexión"}
      </button>

      {isLoading && (
        <p role="status" aria-live="polite">
          Conectando con Groq...
        </p>
      )}
      {error && <p role="alert">{error}</p>}

      {result && (
        <section aria-live="polite" aria-label="Resultado de la prueba">
          <h2>Respuesta</h2>
          <p>{result.content}</p>
          <p>Modelo: {result.model}</p>
          <p>
            Tokens: {result.usage.prompt_tokens} de entrada, {result.usage.completion_tokens} de
            salida, {result.usage.total_tokens} en total.
          </p>
          <p>
            Latencia: {result.latencyMs.toFixed(0)} ms. Velocidad: {result.tokensPerSecond.toFixed(2)}
            tokens/s.
          </p>
        </section>
      )}
    </main>
  );
}