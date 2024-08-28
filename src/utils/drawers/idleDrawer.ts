import Clock from "../clock";
import BaseDrawer from "./baseDrawer";
import { getDimensions } from "../helpers";

const FORTUNE_TELLER_IDLE_IMAGE_URL = `${
  import.meta.env.VITE_MEDIA_LINK
}/fortunetellerIdle.webp`;

class IdleDrawer extends BaseDrawer {
  private fortuneTellerIdleImage = new Image();
  private clock = new Clock();

  init = () =>
    new Promise((resolve) => {
      this.fortuneTellerIdleImage.addEventListener("load", resolve);
      this.fortuneTellerIdleImage.src = FORTUNE_TELLER_IDLE_IMAGE_URL;
    });

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.clock.running) this.clock.start();

    const { width } = getDimensions();
    const scale = width / this.fortuneTellerIdleImage.width;

    const now = (this.clock.getElapsedTime() * 6).toFixed(2);

    ctx.save();
    ctx.scale(scale, scale);
    ctx.translate(0, Math.sin(Number(now)) * 10);
    ctx.drawImage(this.fortuneTellerIdleImage, 0, 0);
    ctx.restore();
  }

  reset(): void {
    this.clock.stop();
  }
}

export default IdleDrawer;
