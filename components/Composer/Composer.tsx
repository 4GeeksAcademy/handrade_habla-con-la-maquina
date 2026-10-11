import type { FormEvent } from "react";
import styles from "./Composer.module.css";

interface ComposerProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  onSend: () => void;
}

export default function Composer({ value, onChange, disabled, onSend }: ComposerProps) {
  const canSend = !disabled && value.trim().length > 0;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSend) {
      return;
    }

    onSend();
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
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.nativeEvent.isComposing) {
            return;
          }

          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            event.currentTarget.form?.requestSubmit();
          }
        }}
        placeholder="Escribe a la Máquina…"
      />
      <div className={styles.controls}>
        <button className={styles.sendButton} type="submit" disabled={!canSend} aria-label="Enviar mensaje">
          <span aria-hidden="true">↑</span>
        </button>
      </div>
    </form>
  );
}
