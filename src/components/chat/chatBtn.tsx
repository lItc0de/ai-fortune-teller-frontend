import { useEffect } from "react";
import ChatBtnModel from "./chatBtn.model";
import style from "./chatBtn.module.css";

const ChatBtn: React.FC<ChatBtnModel> = ({ number, label, handleClick }) => {
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === number) {
        document.removeEventListener("keydown", handleKeydown);
        if (handleClick) handleClick(number);
      }
    };

    document.addEventListener("keydown", handleKeydown);

    return () => document.removeEventListener("keydown", handleKeydown);
  }, [number, handleClick]);

  return (
    <button
      className={style.btn}
      onClick={() => handleClick && handleClick(number)}
    >
      [{number}] {label}
    </button>
  );
};

export default ChatBtn;
