import { createContext } from "react";
import { AnimationStateId, SessionStateId } from "../constants";

export const StateContext = createContext<{
  sessionStateId: SessionStateId;
  animationStateId: AnimationStateId;
  setSessionStateId: (id: SessionStateId) => void;
  setAnimationStateId: (id: AnimationStateId) => void;
}>({
  sessionStateId: SessionStateId.NO_SESSION,
  animationStateId: AnimationStateId.IDLE,
  setSessionStateId: () => {},
  setAnimationStateId: () => {},
});
