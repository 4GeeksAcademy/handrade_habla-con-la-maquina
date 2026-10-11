import styles from "./EmptyState.module.css";

interface EmptyStateProps {
  suggestions: string[];
  onPick: (text: string) => void;
}

export default function EmptyState({ suggestions, onPick }: EmptyStateProps) {
  return (
    <section className={styles.emptyState} aria-labelledby="empty-state-title">
      <h2 id="empty-state-title">
        Pregunta lo que quieras.
        <br />
        <span>Mira lo que cuesta.</span>
      </h2>
      <p className={styles.intro}>
        Cada respuesta muestra los tokens que ha leído y escrito el modelo. Empieza con una de estas preguntas:
      </p>
      <ul className={styles.suggestions}>
        {suggestions.map((suggestion) => (
          <li key={suggestion}>
            <button type="button" onClick={() => onPick(suggestion)}>
              <span>{suggestion}</span>
              <span className={styles.arrow} aria-hidden="true">↗</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
