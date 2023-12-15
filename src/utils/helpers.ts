import { Dimensions } from "../types";

export const BALL_SIZE = 184;
export const BACKGROUND_DIMENSIONS = { width: 1280, height: 720 };

export const sleep = () =>
  new Promise((resolve) => window.requestAnimationFrame(resolve));

export const sleepMs = (ms: number = 0) =>
  new Promise((resolve) =>
    setTimeout(() => window.requestAnimationFrame(resolve), ms)
  );

export const getDimensions = (): Dimensions => {
  const backgroundRatio =
    BACKGROUND_DIMENSIONS.height / BACKGROUND_DIMENSIONS.width;
  const windowRatio = window.innerHeight / window.innerWidth;

  let width;
  let height;

  if (backgroundRatio >= windowRatio) {
    height = window.innerHeight;
    width = height / backgroundRatio;
  } else {
    width = window.innerWidth;
    height = width * backgroundRatio;
  }

  const ratio = width / BACKGROUND_DIMENSIONS.width;
  return { width, height, ratio };
};

export const resizeCanvas = (canvas: HTMLCanvasElement) => {
  const dimensions = getDimensions();
  canvas.width = dimensions.width;
  canvas.height = dimensions.height;
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
