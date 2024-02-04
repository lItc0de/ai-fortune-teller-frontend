abstract class BaseDrawer {
  abstract init(): Promise<unknown>;
  abstract draw(ctx: CanvasRenderingContext2D): void;
  abstract reset(): void;
}

export default BaseDrawer;
