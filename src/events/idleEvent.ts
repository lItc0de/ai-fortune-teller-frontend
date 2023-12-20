import fortuneTellerIdleImage from "../media/fortunetellerIdle.png";
import { Dimensions } from "../types";

class IdleEvent {
  private ctx: CanvasRenderingContext2D;
  private fortuneTellerIdleImage = new Image();
  private loaded = false;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;

    this.loadImage();
  }

  private loadImage() {
    this.fortuneTellerIdleImage.addEventListener("load", () => {
      if (!this.loaded) this.loaded = true;
    });

    this.fortuneTellerIdleImage.src = fortuneTellerIdleImage;
  }

  drawIdleAnimation(dimensions: Dimensions) {
    if (!this.loaded) return;

    const fortuneTellerImgWidth = this.fortuneTellerIdleImage.width;
    const { width } = dimensions;
    const scale = width / fortuneTellerImgWidth;

    const now = (Date.now() / 150).toFixed(2);

    this.ctx.save();
    this.ctx.scale(scale, scale);
    this.ctx.translate(0, Math.sin(Number(now)) * 10);
    this.ctx.drawImage(this.fortuneTellerIdleImage, 0, 0);
    this.ctx.restore();
  }
}

export default IdleEvent;
