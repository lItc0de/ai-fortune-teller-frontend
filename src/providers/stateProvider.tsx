import { createContext } from "react";
import { AnimationStateId, SessionStateId } from "../constants";

export const StateContext = createContext<{
  sessionStateId: SessionStateId;
  setSessionStateId: (id: SessionStateId) => void;

  animationStateId: AnimationStateId;
  setAnimationStateId: (id: AnimationStateId) => void;

  showChat: boolean;
  setShowChat: (show: boolean) => void;
}>({
  sessionStateId: SessionStateId.NO_SESSION,
  setSessionStateId: () => {},

  animationStateId: AnimationStateId.IDLE,
  setAnimationStateId: () => {},

  showChat: false,
  setShowChat: () => {},
});
