import { useContext, useEffect, useState } from "react";
import styles from "./chatMessage.module.css";
import { FORTUNE_TELLER_USER } from "../../constants";
import { UserContext } from "../../providers/userProvider";
import ChatMessageModel from "./chatMessage.model";
import { ChatElementsContext } from "../../providers/chatElementsProvider";
import { KeyboardContext } from "../../providers/keyboardProvider";
import { Topic } from "../../utils/serverMessage";
import useTyping from "../../hooks/useTyping";

const ChatMessage: React.FC<ChatMessageModel> = ({
  done,
  isFortuneTeller,
  text,
  handleDone,
  id,
  awaitsEnter,
  topic,
}) => {
  const { user } = useContext(UserContext);
  const { setChatElementDone } = useContext(ChatElementsContext);
  const { key } = useContext(KeyboardContext);
  const [userName, setUserName] = useState("");
  const { startTypingWithTTS, textPart, typingDone } = useTyping(text);

  useEffect(() => {
    let name = user?.name;
    if (!name) name = "User";

    setUserName(name);
  }, [user?.name]);

  useEffect(() => {
    if (done || typingDone) return;

    startTypingWithTTS();
  }, [startTypingWithTTS, done, typingDone]);

  useEffect(() => {
    if (!done && typingDone) setChatElementDone(id);
  }, [done, typingDone, setChatElementDone, id]);

  useEffect(() => {
    if (!typingDone || !handleDone) return;
    if (awaitsEnter && key === "Enter") handleDone();
  }, [typingDone, handleDone, awaitsEnter, key]);

  useEffect(() => {
    if (awaitsEnter) return;
    if (typingDone && handleDone) handleDone();
  }, [typingDone, handleDone, awaitsEnter]);

  const chatStyle =
    topic !== undefined
      ? [styles.outputWrapper, styles[Topic[topic].toLowerCase()]].join(" ")
      : styles.outputWrapper;

  return (
    <div className={chatStyle}>
      <label className={styles.label}>
        {isFortuneTeller ? FORTUNE_TELLER_USER : userName}
      </label>

      <output className={styles.output}>
        {done ? text : textPart}
        &nbsp;
        {typingDone && awaitsEnter && <span className="key-hint">[Enter]</span>}
      </output>
    </div>
  );
};

export default ChatMessage;
