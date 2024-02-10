import Button from "../button";
import ChatBtnsModel from "./chatBtns.model";
import style from "./chatBtns.module.css";

const ChatActionButtons: React.FC<ChatBtnsModel> = ({ btns }) => {
  return (
    <div className={style.wrapper}>
      {btns.map((chatBtn) => (
        <Button {...chatBtn} />
      ))}
    </div>
  );
};

export default ChatActionButtons;
