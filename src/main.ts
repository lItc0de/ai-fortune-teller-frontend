import "./style.css";
import { FaceDetection } from "./face";

import {
  GlassBallImageHelper,
  WebCamHelper,
  resizeCanvas,
  sleep,
} from "./utils/helpers";
import { Dimensions } from "./types";
import State from "./state";

globalThis.speechSynthesisEnabled = false;
globalThis.cheetahEnabled = import.meta.env.PROD;

class Main {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private webCamHelper: WebCamHelper;
  private glassBallImageHelper: GlassBallImageHelper;

  private faceDetection: FaceDetection;
  private state: State;

  private dimensions: Dimensions;

  constructor() {
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

    this.dimensions = resizeCanvas(this.canvas);

    this.webCamHelper = new WebCamHelper();
    this.glassBallImageHelper = new GlassBallImageHelper(this.ctx);

    this.state = new State();

    this.addEventListeners();

    this.faceDetection = new FaceDetection(this.state.newSession);
  }

  handleStart = async () => {
    this.webCamHelper.start();
    await this.faceDetection.init();
    this.draw();
  };

  async draw() {
    do {
      this.glassBallImageHelper.draw(this.dimensions);
      this.faceDetection.draw();

      await sleep();
      this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    } while (true);
  }

  resize = () => {
    this.dimensions = resizeCanvas(this.canvas);
  };

  addEventListeners() {
    this.addEventListenerResize();
    this.addEventListenerStartBtn();
  }

  addEventListenerStartBtn() {
    const startBtn = document.getElementById("startBtn");
    startBtn?.addEventListener("click", this.handleStart);
  }

  addEventListenerResize() {
    window.addEventListener("resize", this.resize);
  }
}

(() => new Main())();
