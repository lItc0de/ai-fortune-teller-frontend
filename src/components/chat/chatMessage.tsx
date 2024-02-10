import { useContext, useEffect, useState } from "react";
import styles from "./chatMessage.module.css";
import { FORTUNE_TELLER_USER } from "../../constants";
import { UserContext } from "../../providers/userProvider";
import ChatMessageModel from "./chatMessage.model";
import { sleep } from "../../utils/helpers";
import { ChatElementsContext } from "../../providers/chatElementsProvider";

const ChatMessage: React.FC<ChatMessageModel> = ({
  done,
  isFortuneTeller,
  text,
  handleDone,
  id,
}) => {
  const { user } = useContext(UserContext);
  const { setChatElementDone } = useContext(ChatElementsContext);
  const [userName, setUserName] = useState("");
  const [innerDone, setInnerDone] = useState(done);
  const [innerText, setInnerText] = useState("");

  useEffect(() => {
    let name = user?.name;
    if (!name) name = "User";

    setUserName(name);
  }, [user?.name]);

  useEffect(() => {
    if (innerDone && handleDone) handleDone();
  }, [innerDone, handleDone]);

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
      setInnerDone(true);
    };

    addTextPart();
    return () => {
      unmounted = true;
    };
  }, [innerDone, text, id]);

  useEffect(() => {
    if (!done && innerDone) {
      setChatElementDone(id);
    }
  }, [done, innerDone, setChatElementDone, id]);

  return (
    <div className={styles.output}>
      <label className={styles.label}>
        {isFortuneTeller ? FORTUNE_TELLER_USER : userName}
      </label>
      <output className={styles.output}>{innerText}</output>
    </div>
  );
};

export default ChatMessage;
