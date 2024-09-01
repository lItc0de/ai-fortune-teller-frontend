import { useContext, useEffect, useRef } from "react";
import styles from "./chat.module.css";
import ChatMessage from "./chatMessage";
import ChatBtns from "./chatBtns";
import { ChatElementsContext } from "../../providers/chatElementsProvider";
import ChatMessageModel from "./chatMessage.model";
import ChatBtnsModel from "./chatBtns.model";
import ChatInputModel from "./chatInput.model";
import ChatInput from "./chatInput";
import ChatOptionsModel from "./chatOptions.model";
import ChatOptions from "./chatOptions";

const Chat: React.FC = () => {
  const { chatElements } = useContext(ChatElementsContext);
  const chatListEl = useRef<HTMLUListElement>(null);

  useEffect(() => {
    chatListEl.current?.scrollTo(0, chatListEl.current.scrollHeight);
  }, [chatElements]);

  return (
    <section className={styles.chat}>
      <ul className={styles.chatElements} ref={chatListEl}>
        {[...chatElements.values()].map((chatElement) => {
          if (chatElement instanceof ChatMessageModel) {
            return <ChatMessage {...chatElement} key={chatElement.id} />;
          } else if (chatElement instanceof ChatBtnsModel) {
            return <ChatBtns {...chatElement} key={chatElement.id} />;
          } else if (chatElement instanceof ChatInputModel) {
            return <ChatInput {...chatElement} key={chatElement.id} />;
          } else if (chatElement instanceof ChatOptionsModel) {
            return <ChatOptions {...chatElement} key={chatElement.id} />;
          }
        })}
      </ul>
    </section>
  );
};

export default Chat;
