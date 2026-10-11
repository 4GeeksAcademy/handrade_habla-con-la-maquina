import styles from "./ErrorBanner.module.css";

interface ErrorBannerProps {
  onRetry: () => void;
}

export default function ErrorBanner({ onRetry }: ErrorBannerProps) {
  return (
    <div className={styles.banner} role="alert">
      <div className={styles.message}>
        <span className={styles.mark} aria-hidden="true">
          !
        </span>
        <p>
          <strong>No se pudo obtener respuesta.</strong> El modelo tardó demasiado. No se han consumido tokens.
        </p>
      </div>
      <button className={styles.retry} type="button" onClick={onRetry}>
        Reintentar
      </button>
    </div>
  );
}
