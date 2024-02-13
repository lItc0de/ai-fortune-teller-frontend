import { useContext, useEffect, useState } from "react";
import styles from "./chatMessage.module.css";
import { FORTUNE_TELLER_USER } from "../../constants";
import { UserContext } from "../../providers/userProvider";
import ChatMessageModel from "./chatMessage.model";
import { sleep } from "../../utils/helpers";
import { ChatElementsContext } from "../../providers/chatElementsProvider";
import useTTS from "../../hooks/useTTS";
import TTSDisabledError from "../../errors/ttsDisabledError";
import TTSNetworkError from "../../errors/ttsNetworkError";
import { KeyboardContext } from "../../providers/keyboardProvider";

const ChatMessage: React.FC<ChatMessageModel> = ({
  done,
  isFortuneTeller,
  text,
  handleDone,
  id,
  awaitsEnter,
}) => {
  const { user } = useContext(UserContext);
  const { setChatElementDone } = useContext(ChatElementsContext);
  const { key } = useContext(KeyboardContext);
  const [userName, setUserName] = useState("");
  const [innerDone, setInnerDone] = useState(done);
  const [innerText, setInnerText] = useState("");
  const { playSound, transcribe } = useTTS();

  useEffect(() => {
    let name = user?.name;
    if (!name) name = "User";

    setUserName(name);
  }, [user?.name]);

  useEffect(() => {
    if (innerDone) {
      setInnerText(text);
      return;
    }
    let unmounted = false;

    const addTextPart = async () => {
      const textParts = text.split(" ");
      for (let i = 0; i < textParts.length; i++) {
        if (unmounted) return;
        const part = textParts[i];
        setInnerText((prevText) => [prevText, part].join(" "));
        await sleep(100);
      }
    };

    const textWithSound = async () => Promise.all([addTextPart(), playSound()]);

    const start = async () => {
      try {
        await transcribe(text);
        await textWithSound();
      } catch (error) {
        if (
          error instanceof TTSDisabledError ||
          error instanceof TTSNetworkError
        ) {
          await addTextPart();
        }
      }

      setInnerDone(true);
    };

    start();
    return () => {
      unmounted = true;
    };
  }, [innerDone, text, id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!done && innerDone) setChatElementDone(id);
  }, [done, innerDone, setChatElementDone, id]);

  useEffect(() => {
    if (!innerDone || !handleDone) return;
    if (awaitsEnter && key === "Enter") handleDone();
  }, [innerDone, handleDone, awaitsEnter, key]);

  useEffect(() => {
    if (awaitsEnter) return;
    if (innerDone && handleDone) handleDone();
  }, [innerDone, handleDone, awaitsEnter]);

  return (
    <div className={styles.output}>
      <label className={styles.label}>
        {isFortuneTeller ? FORTUNE_TELLER_USER : userName}
      </label>

      <output className={styles.output}>
        {innerText || "Typing..."}&nbsp;
        {innerDone && awaitsEnter && <span className="key-hint">[Enter]</span>}
      </output>
    </div>
  );
};

export default ChatMessage;
