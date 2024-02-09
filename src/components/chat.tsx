import { forwardRef, useContext, useImperativeHandle, useState } from "react";
import ChatMessage from "./chatMessage";
import styles from "./chat.module.css";
import { SettingsContext } from "../stateProvider";
import { Message } from "../types";
import { waitForEnter } from "../utils/helpers";
import useTTS from "../hooks/useTTS";

export type ChatRefProps = {
  addMessageFortuneTeller: (text: string) => Promise<void>;
  addUserInput: () => Promise<string>;
};

const Chat = forwardRef<ChatRefProps>((_, ref) => {
  const { ttsEnabled } = useContext(SettingsContext);
  const [messages, setMessages] = useState<Message[]>([]);
  const { transcribe, playSound } = useTTS(ttsEnabled);

  // const addMessagePartially = async (message: Message) => {
  //   const { user, timestamp } = message;
  //   const parts = message.text.split(" ");
  //   let text = "";
  //   for (let i = 0; i < parts.length; i++) {
  //     text = [text, parts[i]].join(" ");
  //     // const oldMessages = i === 0 ? messages : messages.slice(0, -1);
  //     setMessages([...messages.slice(0, -1), { text, user, timestamp }]);
  //     await sleep(100);
  //   }
  // };

  const addMessageFortuneTeller = async (text: string) => {
    const timestamp = Date.now();
    const message: Message = {
      text,
      isFortuneTeller: true,
      isInput: false,
      timestamp,
    };
    try {
      await transcribe(text);
      await Promise.all([playSound(), addMessage(message)]);
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          console.log("abortError yay");
        } else if (error.message === "TTS disabled") {
          console.log("TTS disabled");
        } else {
          throw error;
        }
      }
    }
    await waitForEnter();
  };

  const addMessage = async (message: Message) => {
    // if (message.isFortuneTeller) {
    //   await addMessageFortuneTeller(message);
    //   return;
    // }
    setMessages((oldMessages) => [...oldMessages.slice(0, -1), message]);
  };

  const addUserInput = async () =>
    new Promise<string>((resolve) => {
      const timestamp = Date.now();
      const onSubmit = (value: string) => {
        console.log("onsubmit", value);

        return resolve(value);
      };

      addMessage({
        isFortuneTeller: false,
        isInput: true,
        timestamp,
        onSubmit,
      });
    });

  useImperativeHandle(ref, () => ({
    addMessageFortuneTeller,
    addUserInput,
  }));

  return (
    <section className={styles.outputWrapper}>
      {messages.map((message) => (
        <ChatMessage
          isFortuneTeller={message.isFortuneTeller}
          isInput={message.isInput}
          message={message.text}
          key={message.timestamp}
          onSubmit={message.onSubmit}
        />
      ))}
    </section>
  );
});

export default Chat;
