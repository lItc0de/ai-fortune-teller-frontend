import { useCallback, useContext, useEffect } from "react";
import styles from "./topicSelectStory.module.css";
import { StateContext } from "../providers/stateProvider";
import { SessionStateId } from "../constants";
import { Topic } from "../utils/serverMessage";
import { ChatElementsContext } from "../providers/chatElementsProvider";
import { KeyboardContext } from "../providers/keyboardProvider";

const BUTTONS = [
  { key: "1", topic: Topic.LOVE, label: "Love" },
  { key: "2", topic: Topic.CAREER, label: "Career" },
  { key: "3", topic: Topic.GENERAL, label: "General" },
  // { key: "4", topic: Topic.QUESTION, label: "Ask a question" },
];

const FortuneSelectStory: React.FC = () => {
  const { setSessionStateId, setTopic } = useContext(StateContext);
  const { clearChatElements } = useContext(ChatElementsContext);
  const { keys } = useContext(KeyboardContext);

  const handleClick = useCallback(
    (topic: Topic) => {
      setTopic(topic);

      setSessionStateId(SessionStateId.FORTUNE_TELLER);
    },
    [setSessionStateId, setTopic]
  );

  useEffect(() => {
    const matchedBtns = BUTTONS.filter(({ key }) => keys.get(key));
    if (matchedBtns.length === 0) return;
    const matchedBtn = matchedBtns[0];
    handleClick(matchedBtn.topic);
  }, [handleClick, keys]);

  useEffect(() => {
    clearChatElements();
  }, [clearChatElements]);

  return (
    <section className={styles.fortuneSelect}>
      {BUTTONS.map(({ key, topic, label }) => (
        <button
          className={[
            styles.selectBtn,
            styles[Topic[topic].toLocaleLowerCase()],
          ].join(" ")}
          onClick={() => handleClick(topic)}
          key={key}
        >
          <span className="key-hint">[{key}]</span> {label}
        </button>
      ))}
    </section>
  );
};

export default FortuneSelectStory;
