import { AnimationStateId } from "../../constants";
import Clock from "../clock";
import { getDimensions } from "../helpers";
import GlassBallBaseDrawer from "./glassBallBaseDrawer";

class NewSessionDrawer extends GlassBallBaseDrawer {
  private video: HTMLVideoElement;
  private clock = new Clock();
  private animationStateId: AnimationStateId;

  constructor(animationStateId: AnimationStateId) {
    super();

    this.video = document.getElementById(
      `video${animationStateId}`
    ) as HTMLVideoElement;

    this.animationStateId = animationStateId;
  }

  init = async () => {
    await this.loadGlassBallImage();
  };

  draw(ctx: CanvasRenderingContext2D): void {
    if (!this.video) return;
    if (!this.clock.running) this.clock.start();

    const { width, ratio, height } = getDimensions();

    // Draw character
    const scale = width / this.video.videoWidth;
    ctx.save();
    ctx.scale(scale, scale);
    ctx.drawImage(
      this.video,
      0,
      0,
      this.video.videoWidth,
      this.video.videoHeight
    );
    ctx.restore();

    if (this.animationStateId !== AnimationStateId.NEW_SESSION_4) return;
    // Draw glassball
    const elapsedTime = this.clock.getElapsedTime();

    const x = 536 * ratio;
    const finalY = 413 * ratio;
    const y = height - (height - finalY) * elapsedTime;
    this.drawXY(x, Math.max(finalY, y), ratio, ctx);
  }

  reset(): void {
    this.clock.stop();
  }
}

export default NewSessionDrawer;
