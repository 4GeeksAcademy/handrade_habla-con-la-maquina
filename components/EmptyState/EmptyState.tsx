import styles from "./EmptyState.module.css";

interface EmptyStateProps {
  prompts: string[];
  onSelectPrompt: (prompt: string) => void;
}

export default function EmptyState({ prompts, onSelectPrompt }: EmptyStateProps) {
  return (
    <section className={styles.emptyState} aria-labelledby="empty-state-title">
      <span className={styles.kicker}>UNA PÁGINA EN BLANCO</span>
      <h2 id="empty-state-title">¿Por dónde empezamos?</h2>
      <p>Elige una idea para abrir la conversación.</p>
      <div className={styles.prompts}>
        {prompts.map((prompt) => (
          <button key={prompt} type="button" onClick={() => onSelectPrompt(prompt)}>
            {prompt}
          </button>
        ))}
      </div>
    </section>
  );
}
