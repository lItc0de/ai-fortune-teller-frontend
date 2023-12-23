import { Box } from "face-api.js";
import BaseDrawer from "./baseDrawer";

const FACE_CANVAS_WIDTH = 250;
const FACE_CANVAS_HEIGHT = 250;

class FaceDrawer extends BaseDrawer {
  private video: HTMLVideoElement;
  private faceCanvas: HTMLCanvasElement;
  private faceCtx: CanvasRenderingContext2D;
  private lastBoxes: Box[] = [];
  private averageBox?: Box;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    super(canvas, ctx);

    this.video = document.getElementById("video") as HTMLVideoElement;
    this.faceCanvas = document.getElementById(
      "faceCanvas"
    ) as HTMLCanvasElement;
    this.faceCtx = this.faceCanvas.getContext("2d") as CanvasRenderingContext2D;
  }

  handleDetect = (faceBox: Box) => {
    this.lastBoxes.push(faceBox);
    this.lastBoxes = this.lastBoxes.slice(-3);
    this.averageBox = this.calculateAverageBox();
  };

  draw() {
    if (!this.averageBox) return;

    this.faceCanvas.width = FACE_CANVAS_WIDTH;
    this.faceCanvas.height = FACE_CANVAS_HEIGHT;
    const offsetY = this.averageBox.height / 2;
    const offsetX = 50;

    const scaleX = (FACE_CANVAS_WIDTH - offsetX) / this.averageBox.width;
    const scaleY = FACE_CANVAS_HEIGHT / this.averageBox.height - 0.4;

    const translateX = offsetX / 2 - this.averageBox.x * scaleX;
    const translateY = offsetY - this.averageBox.y * scaleY;

    this.faceCtx.translate(translateX, translateY);
    this.faceCtx.scale(scaleX, scaleY);
    this.faceCtx.drawImage(
      this.video,
      0,
      0,
      this.video.videoWidth,
      this.video.videoHeight
    );
  }

  private calculateAverageBox(): Box {
    const sumBox = this.lastBoxes.reduce(
      (prev, curr) => {
        return {
          x: prev.x + curr.x,
          y: prev.y + curr.y,
          width: prev.width + curr.width,
          height: prev.height + curr.height,
        };
      },
      { x: 0, y: 0, width: 0, height: 0 }
    );

    const averageBox = {
      x: sumBox.x / this.lastBoxes.length,
      y: sumBox.y / this.lastBoxes.length,
      width: sumBox.width / this.lastBoxes.length,
      height: sumBox.height / this.lastBoxes.length,
    };

    const newFaceBox = averageBox as Box;

    return newFaceBox;
  }
}

export default FaceDrawer;
