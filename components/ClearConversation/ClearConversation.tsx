"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ClearConversation.module.css";

interface ClearConversationProps {
  disabled: boolean;
  messageCount: number;
  onConfirm: () => void;
}

export default function ClearConversation({
  disabled,
  messageCount,
  onConfirm,
}: ClearConversationProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wasConfirming = useRef(false);

  useEffect(() => {
    if (isConfirming) {
      cancelRef.current?.focus();
    } else if (wasConfirming.current) {
      triggerRef.current?.focus();
    }
    wasConfirming.current = isConfirming;
  }, [isConfirming]);

  function cancel() {
    setIsConfirming(false);
  }

  if (isConfirming) {
    return (
      <div
        className={styles.confirmation}
        role="group"
        aria-label="Confirmar borrado de la conversación"
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            cancel();
          }
        }}
      >
        <span className={styles.question}>
          ¿Borrar {messageCount} {messageCount === 1 ? "mensaje" : "mensajes"}?
        </span>
        <button ref={cancelRef} className={styles.cancel} type="button" onClick={cancel}>
          Cancelar
        </button>
        <button
          className={styles.confirm}
          type="button"
          onClick={() => {
            wasConfirming.current = false;
            setIsConfirming(false);
            onConfirm();
          }}
        >
          Sí, borrar
        </button>
      </div>
    );
  }

  return (
    <button
      ref={triggerRef}
      className={styles.trigger}
      type="button"
      disabled={disabled || messageCount === 0}
      aria-label="Borrar conversación"
      onClick={() => setIsConfirming(true)}
    >
      Borrar conversación
    </button>
  );
}
