"use client";

import { useId, useState } from "react";
import styles from "./MeterPanel.module.css";

export interface SessionStats {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  turns: number;
  avgLatencyMs: number | null;
  avgTokensPerSecond: number | null;
  model: string | null;
}

interface MeterPanelProps {
  stats: SessionStats;
}

const formatInteger = (value: number) => Math.round(value).toLocaleString("es-ES");
const formatDecimal = (value: number) =>
  value.toLocaleString("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

function StatsBody({ stats }: MeterPanelProps) {
  const total = stats.totalTokens;
  const promptShare = total > 0 ? (stats.promptTokens / total) * 100 : 0;
  const responseShare = total > 0 ? 100 - promptShare : 0;

  return (
    <div className={styles.statsBody}>
      <div className={styles.primaryStats}>
        <dl className={styles.total}>
          <dt>Total de la sesión</dt>
          <dd>{formatInteger(total)}</dd>
          <dd>{`tokens en ${stats.turns} ${stats.turns === 1 ? "respuesta" : "respuestas"}`}</dd>
        </dl>

        <div
          className={styles.tokenBar}
          role="img"
          aria-label={`Prompt ${Math.round(promptShare)} %, respuesta ${Math.round(responseShare)} %`}
        >
          <span className={styles.promptFill} style={{ width: `${promptShare}%` }} />
          <span className={styles.responseFill} style={{ width: `${responseShare}%` }} />
        </div>

        <dl className={styles.tokenBreakdown}>
          <div>
            <dt><span className={styles.promptDot} aria-hidden="true" />Prompt</dt>
            <dd>{formatInteger(stats.promptTokens)}</dd>
          </div>
          <div>
            <dt><span className={styles.responseDot} aria-hidden="true" />Respuesta</dt>
            <dd>{formatInteger(stats.completionTokens)}</dd>
          </div>
        </dl>
      </div>

      <dl className={styles.details}>
        <div>
          <dt>Modelo</dt>
          <dd className={styles.modelName}>{stats.model ?? "—"}</dd>
        </div>
        <div>
          <dt>Latencia media</dt>
          <dd>{stats.avgLatencyMs === null ? "—" : `${formatInteger(stats.avgLatencyMs)} ms`}</dd>
        </div>
        <div>
          <dt>Velocidad media</dt>
          <dd>
            {stats.avgTokensPerSecond === null
              ? "—"
              : `${formatDecimal(stats.avgTokensPerSecond)} tok/s`}
          </dd>
        </div>
      </dl>

    </div>
  );
}

export default function MeterPanel(props: MeterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();
  const total = props.stats.totalTokens;

  return (
    <section className={styles.panel} aria-label="Medidor de sesión">
      <h2 className={styles.desktopTitle}>Medidor de sesión</h2>
      <button
        className={styles.mobileToggle}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((currentValue) => !currentValue)}
      >
        <span>Medidor de sesión</span>
        <span className={styles.mobileTotal}>
          <strong>{formatInteger(total)}</strong>
          <span>tokens</span>
          <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`} aria-hidden="true">
            ⌄
          </span>
        </span>
      </button>
      <div
        id={panelId}
        className={`${styles.panelContent} ${isOpen ? styles.panelContentOpen : ""}`}
      >
        <StatsBody stats={props.stats} />
      </div>
    </section>
  );
}
