import { useCallback, useContext, useEffect } from "react";
import styles from "./chatOptions.module.css";
import { ChatElementsContext } from "../../providers/chatElementsProvider";
import ChatOptionsModel from "./chatOptions.model";
import { FORTUNE_TELLER_USER } from "../../constants";
import ChatMessageModel from "./chatMessage.model";

const ChatOptions: React.FC<ChatOptionsModel> = ({
  label,
  options,
  id,
  handleDone,
}) => {
  const { addChatElement, removeChatElement } = useContext(ChatElementsContext);

  const handleSelect = useCallback(
    (optionId: string) => {
      removeChatElement(id);
      const optionSelected = options.find(({ id }) => id === optionId);
      if (optionSelected) {
        addChatElement(
          new ChatMessageModel(
            false,
            `
          ${label}
          --> ${optionSelected.text}
          `,
            true
          )
        );
      }
      if (handleDone) handleDone(optionId);
    },
    [addChatElement, handleDone, id, label, options, removeChatElement]
  );

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      const key = Number(e.key);
      if (Number.isNaN(key)) return;

      const optionSelected = options[key - 1];
      if (optionSelected) {
        document.removeEventListener("keydown", handleKeydown);
        handleSelect(optionSelected.id);
      }
    };

    document.addEventListener("keydown", handleKeydown);

    return () => document.removeEventListener("keydown", handleKeydown);
  }, [handleSelect, options]);

  return (
    <div className={styles.optionsWrapper}>
      <label className={styles.label}>{FORTUNE_TELLER_USER}</label>
      <label className={styles.descriptionLabel}>{label}</label>
      <ul className={styles.optionsList}>
        {options.map(({ id, imgSrc, text }, i) => {
          const optionId = `option-${id}`;
          const selectKey = i + 1;
          return (
            <li className={styles.listItem} key={optionId}>
              <input
                className={styles.radio}
                type="radio"
                id={optionId}
                onInput={() => handleSelect(id)}
              />
              <label htmlFor={optionId} className={styles.optionLabel}>
                [{selectKey}]{" "}
                {text || <img className={styles.image} src={imgSrc}></img>}
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ChatOptions;
