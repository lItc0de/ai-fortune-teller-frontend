import { useContext, useEffect, useState } from "react";
import styles from "./chatMessage.module.css";
import { UserContext } from "../stateProvider";
import { FORTUNE_TELLER_USER } from "../constants";
import Input from "./input";
import { Message } from "./chat";

type Props = {
  message: Message;
};

const ChatMessage: React.FC<Props> = ({ message }) => {
  const { user } = useContext(UserContext);
  const [userName, setUserName] = useState("");
  const [outputText, setOutputText] = useState(message.text);
  const [innerIsInput, setInnerIsInput] = useState(message.isInput);

  const handleSubmit = (value: string) => {
    console.log(value);
    setOutputText(value);
    setInnerIsInput(false);

    if (message.onSubmit) message.onSubmit(value);
  };

  useEffect(() => {
    let name = user?.name;
    if (!name) name = "User";

    setUserName(name);
  }, [user?.name]);

  return (
    <div className={styles.output}>
      <label className={styles.label}>
        {message.isFortuneTeller ? FORTUNE_TELLER_USER : userName}
      </label>
      {!innerIsInput && <output className={styles.output}>{outputText}</output>}
      {innerIsInput && <Input onSubmit={handleSubmit} />}
    </div>
  );
};

export default ChatMessage;
