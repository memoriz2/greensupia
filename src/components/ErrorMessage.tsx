"use client";

interface ErrorMessageProps {
  error: string | null;
  onRetry?: () => void;
}

export default function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  if (!error) return null;

  return (
    <div className="error-message" role="alert">
      <p>{error}</p>
      {onRetry && (
        <button onClick={onRetry} className="retry-button">
          다시 시도
        </button>
      )}
    </div>
  );
}
