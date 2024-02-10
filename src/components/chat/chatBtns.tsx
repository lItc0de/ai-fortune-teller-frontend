import { useContext } from "react";
import ChatBtn from "./chatBtn";
import ChatBtnsModel from "./chatBtns.model";
import style from "./chatBtns.module.css";
import { ChatElementsContext } from "../../providers/chatElementsProvider";
import ChatMessageModel from "./chatMessage.model";

const ChatActionButtons: React.FC<ChatBtnsModel> = ({
  btns,
  id,
  handleDone,
}) => {
  const { addChatElement, removeChatElement } = useContext(ChatElementsContext);

  const handleClick = (value: string) => {
    removeChatElement(id);
    const btnClicked = btns.find(({ number }) => number === value);
    if (btnClicked) {
      addChatElement(
        new ChatMessageModel(false, `--> ${btnClicked.label}`, true)
      );
    }
    if (handleDone) handleDone(value);
  };

  return (
    <div className={style.btnWrapper}>
      {btns.map((chatBtn) => (
        <ChatBtn {...chatBtn} handleClick={handleClick} key={chatBtn.id} />
      ))}
    </div>
  );
};

export default ChatActionButtons;
