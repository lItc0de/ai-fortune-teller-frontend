import { useCallback, useContext, useEffect } from "react";
import styles from "./topicSelectStory.module.css";
import { StateContext } from "../providers/stateProvider";
import { SessionStateId } from "../constants";
import { Topic } from "../utils/serverMessage";

const FortuneSelectStory: React.FC = () => {
  const { setSessionStateId, setTopic } = useContext(StateContext);

  const handleClick = useCallback(
    (topic: Topic) => {
      setTopic(topic);

      setSessionStateId(SessionStateId.FORTUNE_TELLER);
    },
    [setSessionStateId, setTopic]
  );

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "1":
          handleClick(Topic.LOVE);
          break;

        case "2":
          handleClick(Topic.CAREER);
          break;

        case "3":
          handleClick(Topic.GENERAL);
          break;

        case "4":
          handleClick(Topic.QUESTION);
          break;

        default:
          return;
      }
      document.removeEventListener("keydown", handleKeydown);
    };

    document.addEventListener("keydown", handleKeydown);

    return () => document.removeEventListener("keydown", handleKeydown);
  }, [handleClick]);

  return (
    <section className={styles.fortuneSelect}>
      <button
        className={[styles.selectBtn, styles.love].join(" ")}
        onClick={() => handleClick(Topic.LOVE)}
      >
        <span className="key-hint">[1]</span> Love
      </button>
      <button
        className={[styles.selectBtn, styles.career].join(" ")}
        onClick={() => handleClick(Topic.CAREER)}
      >
        <span className="key-hint">[2]</span> Career
      </button>
      <button
        className={[styles.selectBtn, styles.general].join(" ")}
        onClick={() => handleClick(Topic.GENERAL)}
      >
        <span className="key-hint">[3]</span> General
      </button>
      <button
        className={styles.selectBtn}
        onClick={() => handleClick(Topic.QUESTION)}
      >
        <span className="key-hint">[4]</span> Ask a question
      </button>
    </section>
  );
};

export default FortuneSelectStory;
