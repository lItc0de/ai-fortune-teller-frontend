import { Dimensions } from "../types";

export const BALL_SIZE = 184;
export const BACKGROUND_DIMENSIONS = { width: 1280, height: 720 };

export const asyncRequestAnimationFrame = () =>
  new Promise((resolve) => window.requestAnimationFrame(resolve));

export const asyncRequestAnimationFrameMs = (ms: number = 0) =>
  new Promise((resolve) =>
    setTimeout(() => window.requestAnimationFrame(resolve), ms)
  );

export const sleep = (ms: number = 1000) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const waitForEnter = () =>
  new Promise<void>((resolve) => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key !== "Enter") return;
      e.preventDefault();

      document.removeEventListener("keydown", handleKeydown);
      resolve();
    };
    document.addEventListener("keydown", handleKeydown);
  });

let dimensions: Dimensions;

export const getDimensions = (recalculate = false): Dimensions => {
  if (dimensions && !recalculate) return dimensions;

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
  dimensions = { width, height, ratio };
  return dimensions;
};

export const resizeCanvas = (canvas: HTMLCanvasElement) => {
  dimensions = getDimensions(true);
  canvas.width = dimensions.width;
  canvas.height = dimensions.height;
};

export class WebCamHelper {
  video: HTMLVideoElement;

  constructor() {
    this.video = document.getElementById("video") as HTMLVideoElement;
  }

  start = () =>
    new Promise((resolve) => {
      this.video.addEventListener("canplay", resolve, false);

      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
          this.video.srcObject = stream;
          this.video.play();
        })
        .catch((err) => {
          console.error(`An error occurred: ${err}`);
        });
    });
}

export const countWords = (str: string) => {
  return str.trim().split(/\s+/).length;
};

export const getSentences = (str: string) => {
  const regexp = new RegExp("(?!\\s).+?[.?!](?=\\s)?", "g");
  return str.trim().match(regexp);
};
