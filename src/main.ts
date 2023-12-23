import "./style.css";
// import "./test.ts";
import FaceDetection from "./utils/faceRecognition/faceDetection";

import {
  getDimensions,
  resizeCanvas,
  asyncRequestAnimationFrame,
} from "./utils/helpers";
import { Dimensions } from "./types";
import State, { StateId } from "./state";
import IdleDrawer from "./utils/idleDrawer";
import EventLoop from "./utils/eventLoop";
import GlassBallDrawer from "./utils/glassBallDrawer";
import FaceDrawer from "./utils/drawers/faceDrawer";

globalThis.speechSynthesisEnabled = false;
globalThis.cheetahEnabled = import.meta.env.PROD;
globalThis.fastText = true;

class Main {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private startBtn: HTMLButtonElement;

  private glassBallDrawer: GlassBallDrawer;
  private idleDrawer: IdleDrawer;
  private faceDrawer: FaceDrawer;

  private faceDetection: FaceDetection;
  private state: State;
  private eventLoop: EventLoop;

  private dimensions: Dimensions;

  constructor() {
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

    this.startBtn = document.getElementById("startBtn") as HTMLButtonElement;

    resizeCanvas(this.canvas);
    this.dimensions = getDimensions();
    this.glassBallDrawer = new GlassBallDrawer(this.ctx);
    this.idleDrawer = new IdleDrawer(this.ctx);
    this.faceDrawer = new FaceDrawer(this.canvas, this.ctx);

    this.eventLoop = new EventLoop();
    this.state = new State(this.eventLoop, this.glassBallDrawer);
    this.faceDetection = new FaceDetection();

    this.addEventListeners();
  }

  handleStart = async () => {
    this.startBtn.style.display = "none";

    this.eventLoop.start();
    await this.faceDetection.init();

    this.draw();
  };

  async draw() {
    do {
      switch (this.state.stateId) {
        case StateId.NO_SESSION:
          this.idleDrawer.drawIdleAnimation(this.dimensions);
          break;

        case StateId.INTRO1:
          this.faceDrawer.draw();
          break;

        case StateId.INTRO2:
          this.faceDrawer.draw();
          this.glassBallDrawer.draw(this.dimensions);
          break;

        case StateId.NEW_SESSION:
          this.faceDrawer.draw();
          break;

        case StateId.WELCOME_OLD_USER1:
          this.faceDrawer.draw();
          break;

        case StateId.WELCOME_OLD_USER2:
          this.faceDrawer.draw();
          this.glassBallDrawer.draw(this.dimensions);
          break;

        case StateId.NAME_FINDING:
          this.faceDrawer.draw();
          this.glassBallDrawer.draw(this.dimensions);
          break;

        case StateId.FORTUNE_TELLER:
          this.faceDrawer.draw();
          this.glassBallDrawer.draw(this.dimensions);
          break;

        case StateId.END_SESSION:
          this.idleDrawer.drawIdleAnimation(this.dimensions);
          break;

        default:
          this.idleDrawer.drawIdleAnimation(this.dimensions);
          break;
      }

      await asyncRequestAnimationFrame();
      this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    } while (true);
  }

  private resize = () => {
    resizeCanvas(this.canvas);
    this.dimensions = getDimensions();
  };

  private addEventListeners() {
    this.addEventListenerResize();
    this.addEventListenerStartBtn();

    this.faceDetection.onDetect = this.faceDrawer.handleDetect;
    this.faceDetection.onUser = this.state.handleUser;
  }

  private addEventListenerStartBtn() {
    this.startBtn.addEventListener("click", this.handleStart);
  }

  private addEventListenerResize() {
    window.addEventListener("resize", this.resize);
  }
}

new Main();
