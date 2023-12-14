import glassBall from "../images/glassBall.png";
import { Dimensions } from "../types";

export const BALL_SIZE = 184;
export const BACKGROUND_DIMENSIONS = { width: 1280, height: 720 };

export const sleep = () =>
  new Promise((resolve) => window.requestAnimationFrame(resolve));

export const sleepMs = (ms: number = 0) =>
  new Promise((resolve) =>
    setTimeout(() => window.requestAnimationFrame(resolve), ms)
  );

export const resizeCanvas = (canvas: HTMLCanvasElement): Dimensions => {
  const backgroundRatio =
    BACKGROUND_DIMENSIONS.height / BACKGROUND_DIMENSIONS.width;
  const windowRatio = window.innerHeight / window.innerWidth;

  if (backgroundRatio >= windowRatio) {
    canvas.height = window.innerHeight;
    canvas.width = canvas.height / backgroundRatio;
  } else {
    canvas.width = window.innerWidth;
    canvas.height = canvas.width * backgroundRatio;
  }

  const ratio = canvas.width / BACKGROUND_DIMENSIONS.width;
  return { width: canvas.width, height: canvas.height, ratio };
};

export class WebCamHelper {
  video: HTMLVideoElement;
  streaming = false;

  constructor() {
    this.video = document.getElementById("video") as HTMLVideoElement;

    this.video.addEventListener(
      "canplay",
      () => {
        if (!this.streaming) {
          this.streaming = true;
        }
      },
      false
    );
  }

  start() {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        this.video.srcObject = stream;
        this.video.play();
      })
      .catch((err) => {
        console.error(`An error occurred: ${err}`);
      });
  }
}

export class GlassBallImageHelper {
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
