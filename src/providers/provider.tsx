import { ReactNode, useEffect, useState, useSyncExternalStore } from "react";
import User from "../user";
import Session from "../session";
import { AnimationStateId, SessionStateId } from "../constants";
import { SettingsContext } from "./settingsProvider";
import { UserContext } from "./userProvider";
import { StateContext } from "./stateProvider";
import { ChatElementsContext } from "./chatElementsProvider";
import ChatElementModel from "../components/chat/chatElement.model";
import KeyboardProvider from "./keyboardProvider";

type Props = {
  userSubscribe: (onStoreChange: () => void) => () => void;
  getCurrentUser: () => User | undefined;
  updateUsername: (name: string) => void;
  updateImage: (image: Blob) => void;
  updateProfileQuestionsSelection: (selection: string[]) => void;
  children: ReactNode;
};

const Provider: React.FC<Props> = ({
  children,
  userSubscribe,
  getCurrentUser,
  updateUsername,
  updateImage,
  updateProfileQuestionsSelection,
}) => {
  const [ttsEnabled] = useState(true);

  const [sessionStateId, setSessionStateId] = useState<SessionStateId>(
    SessionStateId.NO_SESSION
  );
  const [animationStateId, setAnimationStateId] = useState<AnimationStateId>(
    AnimationStateId.IDLE
  );

  const [showChat, setShowChat] = useState(false);

  const user = useSyncExternalStore(userSubscribe, getCurrentUser);

  const [chatElements, setChatElements] = useState(
    new Map<string, ChatElementModel>()
  );

  const addChatElement = (chatElement: ChatElementModel) => {
    if (chatElements.has(chatElement.id)) return;

    setChatElements((oldChatElements) => {
      const updatedMap = oldChatElements.set(chatElement.id, chatElement);
      return new Map([...updatedMap.entries()].slice(-3));
    });
  };

  const removeChatElement = (id: string) => {
    setChatElements((oldChatElements) => {
      if (oldChatElements.delete(id)) return new Map(oldChatElements);
      return oldChatElements;
    });
  };

  const setChatElementDone = (id: string) => {
    if (!chatElements.has(id)) return;

    setChatElements((oldChatElements) => {
      const chatElementToBeUpdated = oldChatElements.get(id);
      if (!chatElementToBeUpdated) return oldChatElements;
      chatElementToBeUpdated.done = true;
      return new Map(oldChatElements);
    });
  };

  const clearChatElements = () =>
    setChatElements(new Map<string, ChatElementModel>());

  useEffect(() => {
    if (!user) return;
    const session = new Session(user, setSessionStateId);

    return () => session.end();
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <SettingsContext.Provider value={{ ttsEnabled }}>
      <UserContext.Provider
        value={{
          user,
          updateUsername,
          updateImage,
          updateProfileQuestionsSelection,
        }}
      >
        <StateContext.Provider
          value={{
            sessionStateId,
            setSessionStateId,
            animationStateId,
            setAnimationStateId,
            showChat,
            setShowChat,
          }}
        >
          <ChatElementsContext.Provider
            value={{
              chatElements,
              addChatElement,
              clearChatElements,
              setChatElementDone,
              removeChatElement,
            }}
          >
            <KeyboardProvider>{children}</KeyboardProvider>
          </ChatElementsContext.Provider>
        </StateContext.Provider>
      </UserContext.Provider>
    </SettingsContext.Provider>
  );
};

export default Provider;
