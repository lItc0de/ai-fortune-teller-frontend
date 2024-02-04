import { getDimensions } from "../helpers";
import GlassBallBaseDrawer from "./glassBallBaseDrawer";

class GlassBallIdleDrawer extends GlassBallBaseDrawer {
  draw(ctx: CanvasRenderingContext2D) {
    const { ratio } = getDimensions();

    const x = 536 * ratio;
    const y = 413 * ratio;

    this.drawXY(x, y, ratio, ctx);
  }

  reset(): void {}
}

export default GlassBallIdleDrawer;
