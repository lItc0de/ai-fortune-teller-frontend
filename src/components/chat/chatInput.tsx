import {
  ChangeEvent,
  FormEvent,
  useRef,
  useState,
  useEffect,
  useContext,
} from "react";
import styles from "./chatInput.module.css";
import ChatInputModel from "./chatInput.model";
import { UserContext } from "../../providers/userProvider";
import { ChatElementsContext } from "../../providers/chatElementsProvider";
import ChatMessageModel from "./chatMessage.model";
import { KeyboardProviderContext } from "../../providers/keyboardProvider";

const ChatInput: React.FC<ChatInputModel> = ({ handleDone, id }) => {
  const { user } = useContext(UserContext);
  const { addChatElement, removeChatElement } = useContext(ChatElementsContext);
  const { setCapture } = useContext(KeyboardProviderContext);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    removeChatElement(id);
    addChatElement(new ChatMessageModel(false, value, true));
    if (handleDone) handleDone(value);
  };

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const handleFocusin = () => setCapture(false);
    input.addEventListener("focusin", handleFocusin);

    const handleFocusout = () => setCapture(true);
    input.addEventListener("focusout", handleFocusout);

    input.focus();

    return () => {
      input.removeEventListener("focusin", handleFocusin);
      setCapture(true);
    };
  }, [setCapture]);

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label htmlFor={id} className={styles.label}>
        {user?.name || "User"}
      </label>
      <input
        id={id}
        onChange={handleChange}
        value={value}
        className={styles.input}
        ref={inputRef}
      />
    </form>
  );
};

export default ChatInput;
