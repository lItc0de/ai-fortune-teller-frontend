import glassBall from "./images/glassBall.png";

export const BALL_SIZE = 250;

export const sleep = () =>
  new Promise((resolve) => window.requestAnimationFrame(resolve));

export const resizeCanvas = (canvas: HTMLCanvasElement) => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
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

  image = new Image();
  loaded = false;

  constructor() {
    this.faceCanvas = document.getElementById(
      "faceCanvas"
    ) as HTMLCanvasElement;

    this.image.addEventListener("load", () => {
      if (!this.loaded) this.loaded = true;
    });

    this.image.src = glassBall;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.loaded) return;

    ctx.save();
    const x = window.innerWidth / 2 - BALL_SIZE / 2;
    const y = window.innerHeight / 2 - BALL_SIZE / 2;
    const radius = 125;
    ctx.beginPath();
    ctx.arc(x + BALL_SIZE / 2, y + BALL_SIZE / 2, radius, 0, Math.PI * 2, true);
    ctx.clip();

    ctx.drawImage(this.faceCanvas, x, y);

    ctx.restore();

    ctx.save();
    const glassBallScale = BALL_SIZE / this.image.width;
    ctx.translate(x, y);
    ctx.scale(glassBallScale, glassBallScale);
    ctx.drawImage(this.image, 0, 0);
    ctx.restore();
  }
}
