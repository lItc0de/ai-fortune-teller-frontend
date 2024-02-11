import { useCallback, useEffect, useState } from "react";

const FACE_CANVAS_SIZE = 250;

const useFaceVideo = (size: number) => {
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
  const canvasRef = useCallback((canvas: HTMLCanvasElement) => {
    if (!canvas) return;
    const canvasCtx = canvas.getContext("2d");
    if (canvasCtx) setCtx(canvasCtx);
  }, []);

  useEffect(() => {
    if (!ctx) return;

    let drawing = true;
    ctx.canvas.width = size;
    ctx.canvas.height = size;

    const faceCanvas = document.getElementById(
      "faceCanvas"
    ) as HTMLCanvasElement;

    if (!faceCanvas) return;

    const scale = size / FACE_CANVAS_SIZE;

    const draw = () => {
      if (!drawing) return;
      ctx.save();
      ctx.scale(scale, scale);
      ctx.drawImage(faceCanvas, 0, 0);
      ctx.restore();
      window.requestAnimationFrame(draw);
    };

    draw();

    return () => {
      drawing = false;
    };
  }, [ctx, size]);

  return { canvasRef };
};

export default useFaceVideo;
