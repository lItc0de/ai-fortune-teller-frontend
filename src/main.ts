import "./style.css";
import FaceDetection from "./faceDetection";

import {
  WebCamHelper,
  getDimensions,
  resizeCanvas,
  sleep,
} from "./utils/helpers";
import { Dimensions } from "./types";
import State, { States } from "./state";
import GlassBallDrawer from "./drawers/glassBallDrawer";
import FortuneTellerIdleDrawer from "./drawers/fortuneTellerIdleDrawer";

globalThis.speechSynthesisEnabled = true;
globalThis.cheetahEnabled = import.meta.env.PROD;

class Main {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private startBtn: HTMLButtonElement;

  private webCamHelper: WebCamHelper;
  private glassBallDrawer: GlassBallDrawer;
  private fortuneTellerIdleDrawer: FortuneTellerIdleDrawer;

  private faceDetection: FaceDetection;
  private state: State;

  private dimensions: Dimensions;

  constructor() {
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

    this.startBtn = document.getElementById("startBtn") as HTMLButtonElement;

    resizeCanvas(this.canvas);
    this.dimensions = getDimensions();

    this.webCamHelper = new WebCamHelper();
    this.glassBallDrawer = new GlassBallDrawer(this.ctx);
    this.fortuneTellerIdleDrawer = new FortuneTellerIdleDrawer(this.ctx);

    this.state = new State(this.glassBallDrawer);

    this.addEventListeners();

    this.faceDetection = new FaceDetection(this.state.newSession);
  }

  handleStart = async () => {
    this.startBtn.style.display = "none";
    this.webCamHelper.start();
    await this.faceDetection.init();
    this.draw();
  };

  async draw() {
    do {
      switch (this.state.currentState) {
        case States.NO_SESSION:
          this.fortuneTellerIdleDrawer.drawIdleAnimation(this.dimensions);
          break;

        case States.NEW_SESSION:
          this.faceDetection.draw();
          break;

        case States.NAME_FINDING:
          this.faceDetection.draw();
          this.glassBallDrawer.draw(this.dimensions);
          break;

        case States.WELCOME_OLD_USER:
          this.faceDetection.draw();
          this.glassBallDrawer.draw(this.dimensions);
          break;

        case States.FORTUNE_TELLER:
          this.faceDetection.draw();
          this.glassBallDrawer.draw(this.dimensions);
          break;

        default:
          this.fortuneTellerIdleDrawer.drawIdleAnimation(this.dimensions);
          break;
      }

      await sleep();
      this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    } while (true);
  }

  resize = () => {
    resizeCanvas(this.canvas);
    this.dimensions = getDimensions();
  };

  addEventListeners() {
    this.addEventListenerResize();
    this.addEventListenerStartBtn();
  }

  addEventListenerStartBtn() {
    this.startBtn.addEventListener("click", this.handleStart);
  }

  addEventListenerResize() {
    window.addEventListener("resize", this.resize);
  }
}

(() => new Main())();
