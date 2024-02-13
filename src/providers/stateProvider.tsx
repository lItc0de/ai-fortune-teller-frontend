import { ReactNode, createContext, useState } from "react";
import { AnimationStateId, SessionStateId } from "../constants";
import { Topic } from "../utils/serverMessage";

export const StateContext = createContext<{
  sessionStateId: SessionStateId;
  setSessionStateId: (id: SessionStateId) => void;

  animationStateId: AnimationStateId;
  setAnimationStateId: (id: AnimationStateId) => void;

  showChat: boolean;
  setShowChat: (show: boolean) => void;

  started: boolean;
  setStarted: (show: boolean) => void;

  topic?: Topic;
  setTopic: (topic: Topic) => void;
}>({
  sessionStateId: SessionStateId.NO_SESSION,
  setSessionStateId: () => {},

  animationStateId: AnimationStateId.IDLE,
  setAnimationStateId: () => {},

  showChat: false,
  setShowChat: () => {},

  started: false,
  setStarted: () => {},

  topic: undefined,
  setTopic: () => {},
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

  const [topic, setTopic] = useState<Topic>();

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
        topic,
        setTopic,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export default StateProvider;
