import { forwardRef, useContext, useImperativeHandle, useState } from "react";
import Output from "./output";
import styles from "./outputWrapper.module.css";
import { SettingsContext } from "../stateProvider";
import { Message } from "../types";
import { FORTUNE_TELLER_USER } from "../constants";
import { sleep, waitForEnter } from "../utils/helpers";
import useTTS from "../hooks/useTTS";

export type OutputWrapperRefProps = {
  addMessage: (message: Message) => Promise<void>;
};

const OutputWrapper = forwardRef<OutputWrapperRefProps>((_, ref) => {
  const { ttsEnabled } = useContext(SettingsContext);
  const [messages, setMessages] = useState<Message[]>([]);
  const { transcribe, playSound } = useTTS(ttsEnabled);

  const addMessagePartially = async (message: Message) => {
    const { user, timestamp } = message;
    const parts = message.text.split(" ");
    let text = "";
    for (let i = 0; i < parts.length; i++) {
      text = [text, parts[i]].join(" ");
      // const oldMessages = i === 0 ? messages : messages.slice(0, -1);
      setMessages([...messages.slice(0, -1), { text, user, timestamp }]);
      await sleep(100);
    }
  };

  const addMessageFortuneTeller = async (message: Message) => {
    try {
      await transcribe(message.text);
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          console.log("abortError yay");

          return;
        }
      }
      throw error;
    }
    await Promise.all([playSound(), addMessagePartially(message)]);
    await waitForEnter();
  };

  const addMessage = async (message: Message) => {
    if (message.user === FORTUNE_TELLER_USER) {
      await addMessageFortuneTeller(message);
      return;
    }
    setMessages((oldMessages) => [...oldMessages, message]);
  };

  useImperativeHandle(ref, () => ({
    addMessage,
  }));

  return (
    <section className={styles.outputWrapper}>
      {messages.map((message) => (
        <Output message={message} key={message.timestamp} />
      ))}
    </section>
  );
});

export default OutputWrapper;
