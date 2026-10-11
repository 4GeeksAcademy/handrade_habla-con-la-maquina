"use client";

import { useState, type FormEvent } from "react";
import styles from "./Composer.module.css";

interface ComposerProps {
  onSubmit: (content: string) => void;
}

export default function Composer({ onSubmit }: ComposerProps) {
  const [draft, setDraft] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = draft.trim();

    if (!content) {
      return;
    }

    onSubmit(content);
    setDraft("");
  }

  return (
    <form className={styles.composer} onSubmit={handleSubmit}>
      <label className={styles.label} htmlFor="message-composer">
        Tu mensaje
      </label>
      <textarea
        id="message-composer"
        className={styles.input}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="Escribe lo que tienes en mente..."
        rows={2}
      />
      <div className={styles.controls}>
        <span className={styles.hint}>Los mensajes se quedan en esta sesión de ejemplo.</span>
        <button className={styles.sendButton} type="submit" disabled={!draft.trim()}>
          Enviar
        </button>
      </div>
    </form>
  );
}
