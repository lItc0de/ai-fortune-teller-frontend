import { ReactNode, createContext, useState } from "react";
import { AnimationStateId, SessionStateId } from "../constants";

export const StateContext = createContext<{
  sessionStateId: SessionStateId;
  setSessionStateId: (id: SessionStateId) => void;

  animationStateId: AnimationStateId;
  setAnimationStateId: (id: AnimationStateId) => void;

  showChat: boolean;
  setShowChat: (show: boolean) => void;

  started: boolean;
  setStarted: (show: boolean) => void;
}>({
  sessionStateId: SessionStateId.NO_SESSION,
  setSessionStateId: () => {},

  animationStateId: AnimationStateId.IDLE,
  setAnimationStateId: () => {},

  showChat: false,
  setShowChat: () => {},

  started: false,
  setStarted: () => {},
});

type Props = {
  children: ReactNode;
};

const StateProvider: React.FC<Props> = ({ children }) => {
  const [sessionStateId, setSessionStateId] = useState<SessionStateId>(
    SessionStateId.NO_SESSION
  );
  const [animationStateId, setAnimationStateId] = useState<AnimationStateId>(
    AnimationStateId.IDLE
  );

  const [showChat, setShowChat] = useState(false);

  const [started, setStarted] = useState(false);

  return (
    <StateContext.Provider
      value={{
        animationStateId,
        setAnimationStateId,
        sessionStateId,
        setSessionStateId,
        showChat,
        setShowChat,
        started,
        setStarted,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export default StateProvider;
