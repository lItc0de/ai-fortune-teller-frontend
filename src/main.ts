import "./style.css";
import { FaceDetection } from "./face";
import Socket from "./socket";

import {
  GlassBallImageHelper,
  WebCamHelper,
  resizeCanvas,
  sleep,
} from "./utils/helpers";
// import { startCheetah } from "./transcribe";

class Main {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private webCamHelper: WebCamHelper;
  private glassBallImageHelper: GlassBallImageHelper;

  private faceDetection: FaceDetection;
  private socket: Socket;

  constructor() {
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

    this.webCamHelper = new WebCamHelper();
    this.glassBallImageHelper = new GlassBallImageHelper();

    this.faceDetection = new FaceDetection();
    this.socket = new Socket();

    resizeCanvas(this.canvas);
    this.addEventListeners();
  }

  handleStart = async () => {
    this.webCamHelper.start();
    await this.faceDetection.init();

    this.draw();

    // startCheetah();
  };

  async draw() {
    do {
      this.glassBallImageHelper.draw(this.ctx);

      if (this.webCamHelper.streaming) {
        const detectedFace = await this.faceDetection.detect();
        if (detectedFace) this.faceDetection.draw(detectedFace.detection.box);
      }

      await sleep();
      this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    } while (true);
  }

  addEventListeners() {
    this.addEventListenerResize();
    this.addEventListenerStartBtn();
  }

  addEventListenerStartBtn() {
    const startBtn = document.getElementById("startBtn");
    startBtn?.addEventListener("click", this.handleStart);
  }

  addEventListenerResize() {
    window.addEventListener("resize", () => resizeCanvas(this.canvas));
  }
}

(() => new Main())();
