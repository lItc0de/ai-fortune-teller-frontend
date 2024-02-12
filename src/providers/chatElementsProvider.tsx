import { ReactNode, createContext, useCallback, useState } from "react";
import ChatElementModel from "../components/chat/chatElement.model";

export const ChatElementsContext = createContext<{
  chatElements: Map<string, ChatElementModel>;
  addChatElement: (chatElement: ChatElementModel) => void;
  clearChatElements: () => void;
  setChatElementDone: (id: string) => void;
  removeChatElement: (id: string) => void;
}>({
  chatElements: new Map<string, ChatElementModel>(),
  addChatElement: () => {},
  clearChatElements: () => {},
  setChatElementDone: () => {},
  removeChatElement: () => {},
});

type Props = {
  children: ReactNode;
};

const ChatElementsProvider: React.FC<Props> = ({ children }) => {
  const [chatElements, setChatElements] = useState(
    new Map<string, ChatElementModel>()
  );

  const addChatElement = useCallback(
    (chatElement: ChatElementModel) => {
      if (chatElements.has(chatElement.id)) return;

      setChatElements((oldChatElements) => {
        const updatedMap = oldChatElements.set(chatElement.id, chatElement);
        return new Map([...updatedMap.entries()].slice(-3));
      });
    },
    [chatElements]
  );

  const removeChatElement = useCallback((id: string) => {
    setChatElements((oldChatElements) => {
      if (oldChatElements.delete(id)) return new Map(oldChatElements);
      return oldChatElements;
    });
  }, []);

  const setChatElementDone = useCallback(
    (id: string) => {
      if (!chatElements.has(id)) return;

      setChatElements((oldChatElements) => {
        const chatElementToBeUpdated = oldChatElements.get(id);
        if (!chatElementToBeUpdated) return oldChatElements;
        chatElementToBeUpdated.done = true;
        return new Map(oldChatElements);
      });
    },
    [chatElements]
  );

  const clearChatElements = useCallback(
    () => setChatElements(new Map<string, ChatElementModel>()),
    []
  );

  return (
    <ChatElementsContext.Provider
      value={{
        chatElements,
        addChatElement,
        clearChatElements,
        setChatElementDone,
        removeChatElement,
      }}
    >
      {children}
    </ChatElementsContext.Provider>
  );
};

export default ChatElementsProvider;
