import "./style.css";
import FaceDetection from "./utils/faceRecognition/faceDetection";
import { resizeCanvas, asyncRequestAnimationFrame } from "./utils/helpers";
import State from "./session";
import IdleDrawer from "./utils/drawers/idleDrawer";
import EventLoop from "./utils/eventLoop";
import GlassBallDrawer from "./utils/drawers/glassBallBaseDrawer";
import FaceDrawer from "./utils/faceRecognition/faceExtractor";
import { StateId } from "./constants";

globalThis.speechSynthesisEnabled = false;
globalThis.cheetahEnabled = import.meta.env.PROD;
globalThis.fastText = true;

class MainAnimation {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private glassBallDrawer: GlassBallDrawer;
  private idleDrawer: IdleDrawer;
  private faceDrawer: FaceDrawer;

  private faceDetection: FaceDetection;
  private state: State;
  private eventLoop: EventLoop;
  private isDrawing = true;

  constructor() {
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

    resizeCanvas(this.canvas);

    this.eventLoop = new EventLoop();
    this.glassBallDrawer = new GlassBallDrawer(this.ctx);
    this.idleDrawer = new IdleDrawer(this.ctx);
    this.state = new State(this.eventLoop, this.glassBallDrawer);
    this.faceDetection = new FaceDetection(this.state.users);
    this.faceDrawer = new FaceDrawer(this.canvas, this.ctx, this.state.users);

    this.addEventListeners();
  }

  async init() {
    await this.state.init();
  }

  handleStart = async () => {
    this.eventLoop.start();
    await this.faceDetection.init();

    this.draw();
  };

  async draw() {
    do {
      switch (this.state.stateId) {
        case StateId.NO_SESSION:
          this.idleDrawer.drawIdleAnimation();
          break;

        case StateId.INTRO1:
          this.faceDrawer.draw();
          break;

        case StateId.INTRO2:
          this.faceDrawer.draw();
          this.glassBallDrawer.draw();
          break;

        case StateId.NEW_SESSION:
          this.faceDrawer.draw();
          break;

        case StateId.WELCOME_OLD_USER1:
          this.faceDrawer.draw();
          break;

        case StateId.WELCOME_OLD_USER2:
          this.faceDrawer.draw();
          this.glassBallDrawer.draw();
          break;

        case StateId.NAME_FINDING:
          this.faceDrawer.draw();
          this.glassBallDrawer.draw();
          break;

        case StateId.FORTUNE_TELLER:
          this.faceDrawer.draw();
          this.glassBallDrawer.draw();
          break;

        case StateId.END_SESSION:
          this.idleDrawer.drawIdleAnimation();
          break;

        default:
          this.idleDrawer.drawIdleAnimation();
          break;
      }

      await asyncRequestAnimationFrame();
      this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    } while (this.isDrawing);
  }

  private resize = () => {
    resizeCanvas(this.canvas);
  };

  private addEventListeners() {
    this.addEventListenerResize();
  }

  private addEventListenerResize() {
    window.addEventListener("resize", this.resize);
  }
}

export default MainAnimation;
