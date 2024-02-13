import { useCallback, useContext, useEffect, useState } from "react";
import styles from "./chatOptions.module.css";
import { ChatElementsContext } from "../../providers/chatElementsProvider";
import ChatOptionsModel from "./chatOptions.model";
import { FORTUNE_TELLER_USER } from "../../constants";
import ChatMessageModel from "./chatMessage.model";
import { KeyboardContext } from "../../providers/keyboardProvider";
import useTyping from "../../hooks/useTyping";

const ChatOptions: React.FC<ChatOptionsModel> = ({
  label,
  options,
  id,
  handleDone,
}) => {
  const { addChatElement, removeChatElement } = useContext(ChatElementsContext);
  const { key } = useContext(KeyboardContext);
  const [startLabelTyping, labelPart, labelDone] = useTyping(label);
  const [showOptions, setShowOptions] = useState(false);

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
    if (!labelDone) return;
    if (Number.isNaN(Number(key))) return;

    const optionNumber = Number(key) - 1;
    const optionSelected = options[optionNumber];

    if (optionSelected) handleSelect(optionSelected.id);
  }, [key, handleSelect, options, labelDone]);

  useEffect(() => {
    startLabelTyping();
  }, [startLabelTyping]);

  useEffect(() => {
    if (!labelDone) return;
    setShowOptions(true);
  }, [labelDone]);

  return (
    <div className={styles.optionsWrapper}>
      <label className={styles.label}>{FORTUNE_TELLER_USER}</label>
      <label className={styles.descriptionLabel}>{labelPart}</label>
      {showOptions && (
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
                  <span className="key-hint">[{selectKey}]</span>{" "}
                  {text || <img className={styles.image} src={imgSrc}></img>}
                </label>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ChatOptions;
