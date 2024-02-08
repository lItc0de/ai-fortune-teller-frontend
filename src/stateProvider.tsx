import {
  ReactNode,
  createContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import User from "./user";
import Session from "./session";
import { AnimationStateId, SessionStateId } from "./constants";
import { Message } from "./types";

export const SettingsContext = createContext({
  ttsEnabled: true,
});

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

export const UserContext = createContext<{
  user: User | undefined;
  updateUsername: (name: string) => void;
}>({ user: undefined, updateUsername: () => {} });

type Props = {
  userSubscribe: (onStoreChange: () => void) => () => void;
  getCurrentUser: () => User | undefined;
  updateUsername: (name: string) => void;
  children: ReactNode;
};

export const MessagesContext = createContext<{
  messages: Message[];
  addMessage: (message: Message) => void;
  clearMessages: () => void;
}>({
  messages: [],
  addMessage: () => {},
  clearMessages: () => {},
});

const StateProvider: React.FC<Props> = ({
  children,
  userSubscribe,
  getCurrentUser,
  updateUsername,
}) => {
  const [ttsEnabled] = useState(true);

  const [sessionStateId, setSessionStateId] = useState<SessionStateId>(
    SessionStateId.NO_SESSION
  );
  const [animationStateId, setAnimationStateId] = useState<AnimationStateId>(
    AnimationStateId.IDLE
  );

  const user = useSyncExternalStore(userSubscribe, getCurrentUser);

  const [messages, setMessages] = useState<Message[]>([]);
  const addMessage = (message: Message) => {
    setMessages((oldMessages: Message[]) => [...oldMessages, message]);
  };
  const clearMessages = () => setMessages([]);

  useEffect(() => {
    if (!user) return;
    const session = new Session(user, setSessionStateId);

    return () => session.end();
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <SettingsContext.Provider value={{ ttsEnabled }}>
      <UserContext.Provider value={{ user, updateUsername }}>
        <StateContext.Provider
          value={{
            sessionStateId,
            animationStateId,
            setSessionStateId,
            setAnimationStateId,
          }}
        >
          <MessagesContext.Provider
            value={{
              messages,
              addMessage,
              clearMessages,
            }}
          >
            {children}
          </MessagesContext.Provider>
        </StateContext.Provider>
      </UserContext.Provider>
    </SettingsContext.Provider>
  );
};

export default StateProvider;
