import BaseDrawer from "./baseDrawer";

const GLASSBALL_IMAGE_URL = `${import.meta.env.VITE_MEDIA_LINK}/glassBall.webp`;

export const BALL_SIZE = 184;

abstract class GlassBallBaseDrawer extends BaseDrawer {
  private faceCanvas: HTMLCanvasElement;

  image = new Image();

  constructor() {
    super();

    this.faceCanvas = document.getElementById(
      "faceCanvas"
    ) as HTMLCanvasElement;
  }

  protected loadGlassBallImage = () =>
    new Promise((resolve) => {
      this.image.addEventListener("load", resolve);

      this.image.src = GLASSBALL_IMAGE_URL;
    });

  protected drawXY(
    x: number,
    y: number,
    ratio: number,
    ctx: CanvasRenderingContext2D
  ) {
    const radius = (BALL_SIZE / 2) * ratio;
    ctx.save();
    ctx.beginPath();
    ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2, true);
    ctx.clip();

    const faceImageScale = (BALL_SIZE / 250) * ratio;
    ctx.translate(x, y);
    ctx.scale(faceImageScale, faceImageScale);
    ctx.filter = "sepia(1) opacity(0.5)";
    ctx.drawImage(this.faceCanvas, 0, 0);
    ctx.restore();

    ctx.save();
    const glassBallScale = (BALL_SIZE / this.image.width) * ratio;
    ctx.translate(x, y);
    ctx.scale(glassBallScale, glassBallScale);
    ctx.filter = "opacity(0.5)";
    ctx.drawImage(this.image, 0, 0);
    ctx.restore();
  }
}

export default GlassBallBaseDrawer;
