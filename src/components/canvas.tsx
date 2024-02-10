import { useContext, useEffect, useRef } from "react";
import { getDimensions } from "../utils/helpers";
import BaseDrawer from "../utils/drawers/baseDrawer";
import IdleDrawer from "../utils/drawers/idleDrawer";
import NewSessionDrawer from "../utils/drawers/newSessionDrawer";
import { AnimationStateId } from "../constants";
import FortuneTellerDrawer from "../utils/drawers/fortuneTellerDrawer";
import { StateContext } from "../providers/stateProvider";

type Props = {
  shouldAnimate: boolean;
};

const Canvas: React.FC<Props> = ({ shouldAnimate }) => {
  const { animationStateId } = useContext(StateContext);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const shouldAnimateRef = useRef(shouldAnimate);
  const animationStateIdRef = useRef(animationStateId);
  const drawers = new Map<AnimationStateId, BaseDrawer>();

  const draw = (ctx: CanvasRenderingContext2D) => {
    if (animationStateIdRef.current === undefined) return;
    if (shouldAnimateRef.current === undefined) return;
    if (drawers.size === 0) return;

    const drawer = drawers.get(animationStateIdRef.current);
    drawer?.draw(ctx);
  };

  const animate = (ctx?: CanvasRenderingContext2D) => {
    if (ctx) {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      draw(ctx);
    }

    animationRef.current = window.requestAnimationFrame(() => animate(ctx));
  };

  useEffect(() => {
    shouldAnimateRef.current = shouldAnimate;
  }, [shouldAnimate]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d") as CanvasRenderingContext2D;
    animationRef.current = window.requestAnimationFrame(() => animate(ctx));

    const recalculate = () => {
      const { width, height } = getDimensions(true);
      ctx.canvas.width = width;
      ctx.canvas.height = height;
    };
    window.addEventListener("resize", recalculate);
    recalculate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", recalculate);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // load drawers
  useEffect(() => {
    const init = async () => {
      const idleDrawer = new IdleDrawer();
      await idleDrawer.init();
      drawers.set(AnimationStateId.IDLE, idleDrawer);

      const fortuneTellerDrawer = new FortuneTellerDrawer();
      await fortuneTellerDrawer.init();
      drawers.set(AnimationStateId.FORTUNE_TELLER, fortuneTellerDrawer);

      const newSession1Drawer = new NewSessionDrawer(
        AnimationStateId.NEW_SESSION_1
      );
      await newSession1Drawer.init();
      drawers.set(AnimationStateId.NEW_SESSION_1, newSession1Drawer);

      const newSession2Drawer = new NewSessionDrawer(
        AnimationStateId.NEW_SESSION_2
      );
      await newSession2Drawer.init();
      drawers.set(AnimationStateId.NEW_SESSION_2, newSession2Drawer);

      const newSession3Drawer = new NewSessionDrawer(
        AnimationStateId.NEW_SESSION_3
      );
      await newSession3Drawer.init();
      drawers.set(AnimationStateId.NEW_SESSION_3, newSession3Drawer);

      const newSession4Drawer = new NewSessionDrawer(
        AnimationStateId.NEW_SESSION_4
      );
      await newSession4Drawer.init();
      drawers.set(AnimationStateId.NEW_SESSION_4, newSession4Drawer);

      // const glassBallFlyInDrawer = new GlassBallFlyInDrawer();
      // await glassBallFlyInDrawer.init();
      // drawers.set(AnimationStateId.FORTUNE_TELLER, glassBallFlyInDrawer);
      // drawers.set(AnimationStateId.NAME_FINDING, glassBallFlyInDrawer);
    };
    init();
  });

  useEffect(() => {
    animationStateIdRef.current = animationStateId;
    for (const drawer of drawers) {
      drawer[1].reset();
    }
  }, [animationStateId]); // eslint-disable-line react-hooks/exhaustive-deps

  return <canvas ref={canvasRef}></canvas>;
};

export default Canvas;
