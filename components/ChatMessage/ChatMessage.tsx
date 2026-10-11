import type { Message } from "@/lib/groq";
import MarkdownContent from "@/components/MarkdownContent/MarkdownContent";
import styles from "./ChatMessage.module.css";

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <article className={styles.message}>
      {isUser ? (
        <div className={styles.userRow}>
          <div className={styles.userBubble}>
            <span className={styles.srOnly}>Tú: </span>
            <p>{message.content}</p>
          </div>
        </div>
      ) : (
        <>
          <span className={styles.srOnly}>La Máquina: </span>
          <MarkdownContent content={message.content} />
          {message.usage && message.metrics && (
            <dl className={styles.metrics}>
              <div>
                <dt>prompt</dt>
                <dd>{message.usage.prompt_tokens.toLocaleString("es-ES")}</dd>
              </div>
              <div>
                <dt>respuesta</dt>
                <dd>{message.usage.completion_tokens.toLocaleString("es-ES")}</dd>
              </div>
              <div>
                <dt>ms</dt>
                <dd>{Math.round(message.metrics.latencyMs).toLocaleString("es-ES")}</dd>
              </div>
              <div>
                <dt>tok/s</dt>
                <dd>{message.metrics.tokensPerSecond.toLocaleString("es-ES", { maximumFractionDigits: 1 })}</dd>
              </div>
            </dl>
          )}
        </>
      )}
    </article>
  );
}
