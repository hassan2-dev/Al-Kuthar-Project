import { useCallback, useEffect, useRef } from "react";

function getCanvasCoords(canvas, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY,
  };
}

/**
 * Empty box for drawing a signature; stores a PNG data URL in parent state.
 */
export default function SignaturePad({ name, value, onSignatureChange, className = "", invalid = false }) {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const lastRef = useRef({ x: 0, y: 0 });
  /** Keeps last value emitted from this pad so we do not redraw from props and erase mid-stroke or flash. */
  const lastEmittedRef = useRef(undefined);

  const paintWhite = useCallback((ctx, w, h) => {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
  }, []);

  useEffect(() => {
    if (value === lastEmittedRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;

    if (!value || !value.startsWith("data:image")) {
      paintWhite(ctx, w, h);
      lastEmittedRef.current = value || "";
      return;
    }

    /* Mark as synced immediately so duplicate effects / re-renders do not clear the canvas while the image decodes. */
    lastEmittedRef.current = value;
    paintWhite(ctx, w, h);
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, w, h);
    };
    img.onerror = () => {
      paintWhite(ctx, w, h);
      lastEmittedRef.current = "";
    };
    img.src = value;
  }, [value, paintWhite]);

  const emitCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    lastEmittedRef.current = url;
    onSignatureChange(name, url);
  }, [name, onSignatureChange]);

  const onPointerDown = useCallback((e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture?.(e.pointerId);
    drawingRef.current = true;
    const { x, y } = getCanvasCoords(canvas, e.clientX, e.clientY);
    lastRef.current = { x, y };
  }, []);

  const onPointerMove = useCallback((e) => {
    if (!drawingRef.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const { x, y } = getCanvasCoords(canvas, e.clientX, e.clientY);
    ctx.strokeStyle = "#1f1f1f";
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(lastRef.current.x, lastRef.current.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    lastRef.current = { x, y };
  }, []);

  const onPointerUp = useCallback(
    (e) => {
      if (!drawingRef.current) return;
      e.preventDefault();
      drawingRef.current = false;
      try {
        canvasRef.current?.releasePointerCapture?.(e.pointerId);
      } catch {
        /* ignore */
      }
      emitCanvas();
    },
    [emitCanvas]
  );

  const handleClear = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      paintWhite(ctx, canvas.width, canvas.height);
      lastEmittedRef.current = "";
      onSignatureChange(name, "");
    },
    [name, onSignatureChange, paintWhite]
  );

  return (
    <div
      className={`sc-signature-pad ${invalid ? "sc-signature-pad--invalid" : ""} ${className}`.trim()}
      data-sale-field={name}
    >
      <canvas
        ref={canvasRef}
        className="sc-signature-pad__canvas"
        width={480}
        height={140}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        role="img"
        aria-label="منطقة التوقيع"
      />
      <button type="button" className="sc-signature-pad__clear" onClick={handleClear}>
        مسح التوقيع
      </button>
    </div>
  );
}
