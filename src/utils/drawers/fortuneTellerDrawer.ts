import fortuneTellerGlassballImage from "../../media/fortuneTellerGlassball.webp";
import { getDimensions } from "../helpers";
import GlassBallBaseDrawer from "./glassBallBaseDrawer";

class FortuneTellerDrawer extends GlassBallBaseDrawer {
  private fortuneTellerGlassballImage = new Image();

  init = async () => {
    await this.loadGlassBallImage();
    await this.loadFortuneTellerGlassballImage();
  };

  private loadFortuneTellerGlassballImage = () =>
    new Promise((resolve) => {
      this.fortuneTellerGlassballImage.addEventListener("load", resolve);
      this.fortuneTellerGlassballImage.src = fortuneTellerGlassballImage;
    });

  draw(ctx: CanvasRenderingContext2D) {
    const { width, ratio } = getDimensions();

    // Draw character
    const scale = width / this.fortuneTellerGlassballImage.width;
    ctx.save();
    ctx.scale(scale, scale);
    ctx.drawImage(this.fortuneTellerGlassballImage, 0, 0);
    ctx.restore();

    // Draw glassball
    const x = 536 * ratio;
    const y = 413 * ratio;

    this.drawXY(x, y, ratio, ctx);
  }

  reset(): void {}
}

export default FortuneTellerDrawer;
