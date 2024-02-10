import { useEffect } from "react";
import ChatBtnModel from "./chat/chatBtn.model";

const Button: React.FC<ChatBtnModel> = ({ number, label, handleClick }) => {
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
    <button onClick={() => handleClick && handleClick(number)}>{label}</button>
  );
};

export default Button;
