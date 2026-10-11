"use client";

import { useState } from "react";
import type { Usage } from "@/lib/groq";
import styles from "./MeterPanel.module.css";

interface MeterPanelProps {
  usage: Usage;
  model: string;
  latencyMs: number;
  tokensPerSecond: number;
}

export default function MeterPanel({
  usage,
  model,
  latencyMs,
  tokensPerSecond,
}: MeterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className={styles.panel} aria-label="Medidor de sesión">
      <button
        className={styles.summary}
        type="button"
        aria-expanded={isOpen}
        aria-controls="session-meter-content"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
      >
        <span className={styles.summaryTitle}>Medidor de sesión</span>
        <strong className={styles.summaryTotal}>{usage.total_tokens.toLocaleString("es-ES")}</strong>
        <span className={styles.summaryAction}>{isOpen ? "Cerrar" : "Ver métricas"}</span>
      </button>

      <div
        className={`${styles.content} ${isOpen ? styles.contentOpen : ""}`}
        id="session-meter-content"
      >
        <div className={styles.panelHeading}>
          <div>
            <p className={styles.eyebrow}>MÉTRICAS DE USO</p>
            <h2>Medidor de sesión</h2>
          </div>
          <span className={styles.sampleMark}>MUESTRA</span>
        </div>

        <div className={styles.totalBlock}>
          <span className={styles.totalLabel}>Tokens totales</span>
          <strong className={styles.totalValue}>{usage.total_tokens.toLocaleString("es-ES")}</strong>
        </div>

        <dl className={styles.stats}>
          <div>
            <dt>Entrada</dt>
            <dd>{usage.prompt_tokens.toLocaleString("es-ES")}</dd>
          </div>
          <div>
            <dt>Salida</dt>
            <dd>{usage.completion_tokens.toLocaleString("es-ES")}</dd>
          </div>
          <div>
            <dt>Latencia acumulada</dt>
            <dd>{latencyMs.toLocaleString("es-ES")} ms</dd>
          </div>
          <div>
            <dt>Velocidad media</dt>
            <dd>{tokensPerSecond.toFixed(1)} tok/s</dd>
          </div>
        </dl>

        <div className={styles.modelBlock}>
          <span className={styles.modelLabel}>MODELO</span>
          <span className={styles.modelName}>{model}</span>
        </div>
      </div>
    </section>
  );
}
