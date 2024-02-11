import { useCallback, useContext, useEffect } from "react";
import styles from "./fortuneSelectStory.module.css";
import { StateContext } from "../providers/stateProvider";
import { SessionStateId } from "../constants";

const FortuneSelectStory: React.FC = () => {
  const { setSessionStateId } = useContext(StateContext);

  const handleClick = useCallback(
    (topic: string) => {
      console.log(topic);

      setSessionStateId(SessionStateId.FORTUNE_TELLER);
    },
    [setSessionStateId]
  );

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "1":
          handleClick("love");
          break;

        case "2":
          handleClick("career");
          break;

        case "3":
          handleClick("general");
          break;

        case "4":
          handleClick("question");
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
        onClick={() => handleClick("love")}
      >
        [1] Love
      </button>
      <button
        className={[styles.selectBtn, styles.career].join(" ")}
        onClick={() => handleClick("career")}
      >
        [2] Career
      </button>
      <button
        className={[styles.selectBtn, styles.general].join(" ")}
        onClick={() => handleClick("general")}
      >
        [3] General
      </button>
      <button
        className={styles.selectBtn}
        onClick={() => handleClick("question")}
      >
        [4] Ask a question
      </button>
    </section>
  );
};

export default FortuneSelectStory;
