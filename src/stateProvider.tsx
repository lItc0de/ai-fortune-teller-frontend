import {
  ReactNode,
  createContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import User from "./user";
import Session from "./session";
import { StateId } from "./constants";
// import { Message } from "./types";

export const StateContext = createContext<{
  stateId: StateId;
  setStateId: (newStateId: StateId) => void;
}>({ stateId: StateId.NO_SESSION, setStateId: () => {} });

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
  const [stateId, setStateId] = useState<StateId>(StateId.NO_SESSION);
  const user = useSyncExternalStore(userSubscribe, getCurrentUser);

  useEffect(() => {
    console.log("user change:", user);

    if (!user) return;
    const session = new Session(user, setStateId);

    return () => session.end();
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    console.debug(StateId[stateId]);
  }, [stateId]);

  return (
    <UserContext.Provider value={{ user, updateUsername }}>
      <StateContext.Provider value={{ stateId, setStateId }}>
        {/* <MessagesContext.Provider value={{ messages, addMessage }}> */}
        {children}
        {/* </MessagesContext.Provider> */}
      </StateContext.Provider>
    </UserContext.Provider>
  );
};

export default StateProvider;
