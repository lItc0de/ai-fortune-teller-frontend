import { createContext } from "react";
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
