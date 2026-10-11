import styles from "./ErrorBanner.module.css";

interface ErrorBannerProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <div className={styles.banner} role="alert">
      <div className={styles.message}>
        <span className={styles.mark} aria-hidden="true">
          !
        </span>
        <p>
          <strong>No se pudo obtener respuesta.</strong> {message}
        </p>
      </div>
      <button className={styles.retry} type="button" onClick={onRetry}>
        Reintentar
      </button>
    </div>
  );
}
