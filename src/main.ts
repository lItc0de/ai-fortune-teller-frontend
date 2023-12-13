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
  private socket: Socket;
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

    this.faceDetection = new FaceDetection();

    this.inOutHelper = new InOutHelper();
    this.state = new State();
    this.socket = new Socket(this.state, this.inOutHelper);

    this.addEventListeners();
    this.draw();

    this.state.newSession("Person1");
    this.socket.init();

    this.transcribe = new Transcribe(this.inOutHelper.writeFromTranscript);
  }

  handleStart = async () => {
    this.webCamHelper.start();
    await this.faceDetection.init();

    if (import.meta.env.PROD) await this.transcribe.start();
    this.started = true;
  };

  async draw() {
    do {
      this.glassBallImageHelper.draw(this.dimensions);

      if (this.started && this.webCamHelper.streaming) {
        const detectedFace = await this.faceDetection.detect();
        if (detectedFace) this.faceDetection.draw(detectedFace.detection.box);
      }

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
