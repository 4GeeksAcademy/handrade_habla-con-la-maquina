import type { Message } from "@/lib/groq";
import styles from "./ChatMessage.module.css";

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <article className={`${styles.message} ${isUser ? styles.user : styles.assistant}`}>
      <p className={styles.speaker}>{isUser ? "Tú" : "Habla con la Máquina"}</p>
      <p className={styles.content}>{message.content}</p>

      {!isUser && message.usage && message.metrics && (
        <p className={styles.metrics}>
          <span>{message.usage.prompt_tokens} entrada</span>
          <span>{message.usage.completion_tokens} salida</span>
          <span>{message.metrics.latencyMs.toFixed(0)} ms</span>
          <span>{message.metrics.tokensPerSecond.toFixed(1)} tok/s</span>
        </p>
      )}
    </article>
  );
}
