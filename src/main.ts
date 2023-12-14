import "./style.css";
import { FaceDetection } from "./face";
import Socket from "./socket";

import {
  GlassBallImageHelper,
  WebCamHelper,
  resizeCanvas,
  sleep,
} from "./utils/helpers";
import { Dimensions } from "./types";
import State from "./state";
import Transcribe from "./transcribe";
import InOutHelper from "./utils/inOutHelper";

class Main {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private webCamHelper: WebCamHelper;
  private glassBallImageHelper: GlassBallImageHelper;

  private faceDetection: FaceDetection;
  private state: State;
  private transcribe: Transcribe;
  private inOutHelper: InOutHelper;

  private dimensions: Dimensions;

  private started = false;

  constructor() {
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

    this.dimensions = resizeCanvas(this.canvas);

    this.webCamHelper = new WebCamHelper();
    this.glassBallImageHelper = new GlassBallImageHelper(this.ctx);

    this.inOutHelper = new InOutHelper();
    this.state = new State(this.inOutHelper);

    this.addEventListeners();

    this.faceDetection = new FaceDetection(this.state.newSession);
    this.transcribe = new Transcribe(this.inOutHelper.writeFromTranscript);
  }

  handleStart = async () => {
    this.webCamHelper.start();
    await this.faceDetection.init();

    if (import.meta.env.PROD) await this.transcribe.start();
    this.started = true;
    this.draw();
  };

  async draw() {
    do {
      this.glassBallImageHelper.draw(this.dimensions);
      this.faceDetection.draw();

      await sleep();
      this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    } while (this.started);
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
