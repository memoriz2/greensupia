"use client";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  message?: string;
}

export default function LoadingSpinner({
  size = "medium",
  message,
}: LoadingSpinnerProps) {
  return (
    <div className={`loading-spinner ${size}`} role="status" aria-live="polite">
      <div className="spinner"></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
}
