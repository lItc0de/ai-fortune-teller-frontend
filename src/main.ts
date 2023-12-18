import "./style.css";
// import "./test.ts";
import FaceDetection from "./faceDetection";

import {
  WebCamHelper,
  getDimensions,
  resizeCanvas,
  sleep,
} from "./utils/helpers";
import { Dimensions } from "./types";
import State from "./state";
import GlassBallDrawer from "./drawers/glassBallDrawer";
import FortuneTellerIdleDrawer from "./drawers/fortuneTellerIdleDrawer";
import { StoryIds } from "./utils/storyState";
import EventLoop from "./messageQueue/eventLoop";

globalThis.speechSynthesisEnabled = false;
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
  private eventLoop: EventLoop;

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

    this.eventLoop = new EventLoop();
    this.state = new State(this.eventLoop, this.glassBallDrawer);

    this.addEventListeners();

    this.faceDetection = new FaceDetection(this.state.newSession);
  }

  handleStart = async () => {
    this.startBtn.style.display = "none";

    this.eventLoop.start();
    this.webCamHelper.start();
    await this.faceDetection.init();

    this.draw();
  };

  async draw() {
    do {
      switch (this.state.storyState.storyId) {
        case StoryIds.NO_SESSION:
          this.fortuneTellerIdleDrawer.drawIdleAnimation(this.dimensions);
          break;

        case StoryIds.INTRO1:
          this.faceDetection.draw();
          break;

        case StoryIds.INTRO2:
          this.faceDetection.draw();
          this.glassBallDrawer.draw(this.dimensions);
          break;

        case StoryIds.NEW_SESSION:
          this.faceDetection.draw();
          break;

        case StoryIds.WELCOME_OLD_USER:
          this.faceDetection.draw();
          break;

        case StoryIds.NAME_FINDING:
          this.faceDetection.draw();
          this.glassBallDrawer.draw(this.dimensions);
          break;

        case StoryIds.FORTUNE_TELLER:
          this.faceDetection.draw();
          this.glassBallDrawer.draw(this.dimensions);
          break;

        case StoryIds.END_SESSION:
          this.fortuneTellerIdleDrawer.drawIdleAnimation(this.dimensions);
          break;

        default:
          this.fortuneTellerIdleDrawer.drawIdleAnimation(this.dimensions);
          break;
      }

      await sleep();
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
  }

  private addEventListenerStartBtn() {
    this.startBtn.addEventListener("click", this.handleStart);
  }

  private addEventListenerResize() {
    window.addEventListener("resize", this.resize);
  }
}

(() => new Main())();
