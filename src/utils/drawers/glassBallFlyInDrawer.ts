import Clock from "../clock";
import { getDimensions } from "../helpers";
import GlassBallBaseDrawer from "./glassBallBaseDrawer";

class GlassBallFlyInDrawer extends GlassBallBaseDrawer {
  clock = new Clock();

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.clock.running) this.clock.start();

    const elapsedTime = this.clock.getElapsedTime();
    const dimensions = getDimensions();
    const { ratio } = dimensions;

    const frames = 60;
    const x = 536 * ratio;
    const finalY = 413 * ratio;
    const y =
      dimensions.height - ((dimensions.height - finalY) / frames) * elapsedTime;
    this.drawXY(x, y, ratio, ctx);
  }

  reset(): void {
    this.clock.stop();
  }
}

export default GlassBallFlyInDrawer;
