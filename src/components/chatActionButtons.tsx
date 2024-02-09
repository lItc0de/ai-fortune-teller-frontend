import Button from "./button";
import { ButtonMessage } from "./chat";
import style from "./chatActionButtons.module.css";

type Props = {
  buttonMessage: ButtonMessage;
};

const ChatActionButtons: React.FC<Props> = ({ buttonMessage }) => {
  return (
    <div className={style.wrapper}>
      {buttonMessage.buttons.map((button) => (
        <Button {...button} />
      ))}
    </div>
  );
};

export default ChatActionButtons;
