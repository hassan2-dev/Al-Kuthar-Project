/* eslint-disable react-hooks/refs */
  import { useEffect, useRef } from "react";

export default function Toast({ open, message, variant = "success", onClose }) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open || !message) return undefined;
    const id = window.setTimeout(() => onCloseRef.current?.(), 4200);
    return () => window.clearTimeout(id);
  }, [open, message]);

  if (!open || !message) return null;

  return (
    <div
      className={`ak-toast ak-toast--${variant}`}
      role={variant === "error" ? "alert" : "status"}
      dir="rtl"
    >
      <span className="ak-toast-icon" aria-hidden="true">
        {variant === "success" ? "✓" : "!"}
      </span>
      <p className="ak-toast-msg">{message}</p>
      <button type="button" className="ak-toast-close" onClick={onClose} aria-label="إغلاق">
        ×
      </button>
    </div>
  );
}
