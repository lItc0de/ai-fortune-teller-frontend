import { AnimationStateId } from "../../constants";
import { getDimensions } from "../helpers";
import BaseDrawer from "./baseDrawer";

class NewSessionDrawer extends BaseDrawer {
  private video: HTMLVideoElement;

  constructor(animationStateId: AnimationStateId) {
    super();

    this.video = document.getElementById(
      `video${animationStateId}`
    ) as HTMLVideoElement;
  }

  async init() {}

  draw(ctx: CanvasRenderingContext2D): void {
    if (!this.video) return;

    const { width } = getDimensions();
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
  }

  reset(): void {}
}

export default NewSessionDrawer;
