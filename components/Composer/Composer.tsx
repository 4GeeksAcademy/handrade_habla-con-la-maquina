"use client";

import { useState, type FormEvent } from "react";
import styles from "./Composer.module.css";

interface ComposerProps {
  disabled: boolean;
  onSend: (content: string) => void;
}

export default function Composer({ disabled, onSend }: ComposerProps) {
  const [value, setValue] = useState("");
  const estimatedTokens = value.trim() ? Math.max(1, Math.round(value.trim().length / 4)) : 0;
  const canSend = !disabled && value.trim().length > 0;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = value.trim();

    if (!canSend || !content) {
      return;
    }

    onSend(content);
    setValue("");
  }

  return (
    <form className={styles.composer} onSubmit={submit}>
      <label className={styles.srOnly} htmlFor="mensaje">
        Escribe tu mensaje
      </label>
      <textarea
        id="mensaje"
        className={styles.input}
        rows={2}
        value={value}
        disabled={disabled}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.nativeEvent.isComposing) {
            return;
          }

          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            event.currentTarget.form?.requestSubmit();
          }
        }}
        aria-describedby="composer-hint"
        placeholder="Escribe a la Máquina…"
      />
      <div className={styles.controls}>
        <p className={styles.hint} id="composer-hint">
          <span className={styles.tokenEstimate}>~{estimatedTokens.toLocaleString("es-ES")}</span>{" "}
          tokens estimados <span className={styles.shortcut}>· Mayús + Intro para salto de línea</span>
        </p>
        <button className={styles.sendButton} type="submit" disabled={!canSend} aria-label="Enviar mensaje">
          <span aria-hidden="true">↑</span>
        </button>
      </div>
    </form>
  );
}
