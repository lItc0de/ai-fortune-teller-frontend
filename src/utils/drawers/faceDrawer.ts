import { Box } from "face-api.js";
import BaseDrawer from "./baseDrawer";
import Users from "../../users";

const FACE_CANVAS_WIDTH = 250;
const FACE_CANVAS_HEIGHT = 250;

class FaceDrawer extends BaseDrawer {
  private video: HTMLVideoElement;
  private faceCanvas: HTMLCanvasElement;
  private faceCtx: CanvasRenderingContext2D;
  private users: Users;

  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    users: Users
  ) {
    super(canvas, ctx);

    this.video = document.getElementById("video") as HTMLVideoElement;
    this.faceCanvas = document.getElementById(
      "faceCanvas"
    ) as HTMLCanvasElement;
    this.faceCtx = this.faceCanvas.getContext("2d") as CanvasRenderingContext2D;
    this.users = users;
  }

  draw() {
    if (!this.averageFaceBox) return;

    this.faceCanvas.width = FACE_CANVAS_WIDTH;
    this.faceCanvas.height = FACE_CANVAS_HEIGHT;
    const offsetY = this.averageFaceBox.height / 2;
    const offsetX = 50;

    const scaleX = (FACE_CANVAS_WIDTH - offsetX) / this.averageFaceBox.width;
    const scaleY = FACE_CANVAS_HEIGHT / this.averageFaceBox.height - 0.4;

    const translateX = offsetX / 2 - this.averageFaceBox.x * scaleX;
    const translateY = offsetY - this.averageFaceBox.y * scaleY;

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

  private get averageFaceBox(): Box | undefined {
    if (!this.users.currentUser?.lastFaceBoxes) return;

    const lastFaceBoxes = this.users.currentUser.lastFaceBoxes;
    const length = lastFaceBoxes.length;

    const sumBox = lastFaceBoxes.reduce(
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
      x: sumBox.x / length,
      y: sumBox.y / length,
      width: sumBox.width / length,
      height: sumBox.height / length,
    };

    const newFaceBox = averageBox as Box;

    return newFaceBox;
  }
}

export default FaceDrawer;
