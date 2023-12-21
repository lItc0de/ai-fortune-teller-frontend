import glassBall from "../media/glassBall.webp";
import { Dimensions } from "../types";
import { getDimensions, sleep } from "./helpers";

export const BALL_SIZE = 184;

class GlassBallDrawer {
  private faceCanvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  image = new Image();
  loaded = false;

  constructor(ctx: CanvasRenderingContext2D) {
    this.faceCanvas = document.getElementById(
      "faceCanvas"
    ) as HTMLCanvasElement;

    this.ctx = ctx;

    this.loadImage();
  }

  loadImage() {
    this.image.addEventListener("load", () => {
      if (!this.loaded) this.loaded = true;
    });

    this.image.src = glassBall;
  }

  draw(dimensions: Dimensions) {
    if (!this.loaded) return;
    const { ratio } = dimensions;

    const x = 536 * ratio;
    const y = 413 * ratio;

    this.drawXY(x, y, ratio);
  }

  async flyIn() {
    if (!this.loaded) return;

    const dimensions = getDimensions();
    const { ratio } = dimensions;

    let i = 0;
    const frames = 60;

    const x = 536 * ratio;
    const finalY = 413 * ratio;

    do {
      i++;

      const y = dimensions.height - ((dimensions.height - finalY) / frames) * i;

      this.drawXY(x, y, ratio);

      await sleep();
      this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    } while (i < frames);
  }

  private drawXY(x: number, y: number, ratio: number) {
    const radius = (BALL_SIZE / 2) * ratio;
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2, true);
    this.ctx.clip();

    const faceImageScale = (BALL_SIZE / 250) * ratio;
    this.ctx.translate(x, y);
    this.ctx.scale(faceImageScale, faceImageScale);
    this.ctx.filter = "sepia(1) opacity(0.5)";
    this.ctx.drawImage(this.faceCanvas, 0, 0);
    this.ctx.restore();

    this.ctx.save();
    const glassBallScale = (BALL_SIZE / this.image.width) * ratio;
    this.ctx.translate(x, y);
    this.ctx.scale(glassBallScale, glassBallScale);
    this.ctx.filter = "opacity(0.5)";
    this.ctx.drawImage(this.image, 0, 0);
    this.ctx.restore();
  }
}

export default GlassBallDrawer;
