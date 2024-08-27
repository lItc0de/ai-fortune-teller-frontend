import { useCallback, useContext, useEffect } from "react";
import ChatBtn from "./chatBtn";
import ChatBtnsModel from "./chatBtns.model";
import style from "./chatBtns.module.css";
import { ChatElementsContext } from "../../providers/chatElementsProvider";
import ChatMessageModel from "./chatMessage.model";
import { KeyboardContext } from "../../providers/keyboardProvider";
import ChatBtnModel from "./chatBtn.model";

const ChatActionButtons: React.FC<ChatBtnsModel> = ({
  btns,
  id,
  handleDone,
}) => {
  const { addChatElement, removeChatElement } = useContext(ChatElementsContext);
  const { keys } = useContext(KeyboardContext);

  const handleClick = useCallback(
    (btnClicked: ChatBtnModel) => {
      removeChatElement(id);
      if (btnClicked) {
        addChatElement(
          new ChatMessageModel(false, `--> ${btnClicked.label}`, true)
        );
      }
      if (handleDone) handleDone(btnClicked.number);
    },
    [id, addChatElement, handleDone, removeChatElement]
  );

  useEffect(() => {
    const matchedBtns = btns.filter(({ number }) => keys.get(number));
    if (matchedBtns.length === 0) return;
    const matchedBtn = matchedBtns[0];

    if (handleClick) handleClick(matchedBtn);
  }, [keys, btns, handleClick]);

  return (
    <div className={style.btnWrapper}>
      {btns.map((chatBtn) => (
        <ChatBtn
          {...chatBtn}
          handleClick={() => handleClick(chatBtn)}
          key={chatBtn.id}
        />
      ))}
    </div>
  );
};

export default ChatActionButtons;
