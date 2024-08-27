import ChatBtnModel from "./chatBtn.model";
import style from "./chatBtn.module.css";

const ChatBtn: React.FC<ChatBtnModel> = ({ number, label, handleClick }) => {
  return (
    <button
      className={style.btn}
      onClick={() => handleClick && handleClick(number)}
    >
      <span className="key-hint">[{number}]</span> {label}
    </button>
  );
};

export default ChatBtn;
