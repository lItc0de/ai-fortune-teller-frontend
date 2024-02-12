import { useContext, useEffect } from "react";
import ChatBtnModel from "./chatBtn.model";
import style from "./chatBtn.module.css";
import { KeyboardProviderContext } from "../../providers/keyboardProvider";

const ChatBtn: React.FC<ChatBtnModel> = ({ number, label, handleClick }) => {
  const { key } = useContext(KeyboardProviderContext);

  useEffect(() => {
    if (key !== number) return;

    if (handleClick) handleClick(number);
  }, [key, handleClick, number]);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === number) {
        document.removeEventListener("keydown", handleKeydown);
        if (handleClick) handleClick(number);
      }
    };

    document.addEventListener("keydown", handleKeydown);

    return () => document.removeEventListener("keydown", handleKeydown);
  }, [number, handleClick, key]);

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
