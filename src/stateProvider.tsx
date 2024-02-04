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

const StateProvider: React.FC<Props> = ({
  children,
  userSubscribe,
  getCurrentUser,
  updateUsername,
}) => {
  const [sessionStateId, setSessionStateId] = useState<SessionStateId>(
    SessionStateId.NO_SESSION
  );
  const [animationStateId, setAnimationStateId] = useState<AnimationStateId>(
    AnimationStateId.IDLE
  );
  const user = useSyncExternalStore(userSubscribe, getCurrentUser);

  useEffect(() => {
    if (!user) return;
    const session = new Session(user, setSessionStateId);

    return () => session.end();
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <UserContext.Provider value={{ user, updateUsername }}>
      <StateContext.Provider
        value={{
          sessionStateId,
          animationStateId,
          setSessionStateId,
          setAnimationStateId,
        }}
      >
        {children}
      </StateContext.Provider>
    </UserContext.Provider>
  );
};

export default StateProvider;
