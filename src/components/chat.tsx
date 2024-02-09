import { forwardRef, useContext, useImperativeHandle, useState } from "react";
import styles from "./chat.module.css";
import { SettingsContext } from "../stateProvider";
import { waitForEnter } from "../utils/helpers";
import useTTS from "../hooks/useTTS";
import ChatMessage from "./chatMessage";
import ChatActionButtons from "./chatActionButtons";

class Btn {
  number: number;
  label: string;
  onClick: (number: number) => void;

  constructor(
    number: number,
    label: string,
    onClick: (number: number) => void
  ) {
    this.number = number;
    this.label = label;
    this.onClick = onClick;
  }
}

export class ButtonMessage {
  buttons: Btn[];
  timestamp: number;

  constructor(buttons: Btn[]) {
    this.buttons = buttons;
    this.timestamp = Date.now();
  }
}

export class Message {
  isFortuneTeller: boolean;
  timestamp: number;
  isInput: boolean;
  text?: string;
  onSubmit?: (value: string) => void;

  constructor(
    isFortuneTeller: boolean,
    timestamp: number,
    isInput: boolean,
    text?: string,
    onSubmit?: (value: string) => void
  ) {
    this.isFortuneTeller = isFortuneTeller;
    this.timestamp = timestamp;
    this.isInput = isInput;
    this.text = text;
    this.onSubmit = onSubmit;
  }
}

export type ChatRefProps = {
  addFortuneTellerMessage: (text: string) => Promise<void>;
  addUserInput: () => Promise<string>;
  addButtons: (buttons: string[]) => Promise<number>;
};

const Chat = forwardRef<ChatRefProps>((_, ref) => {
  const { ttsEnabled } = useContext(SettingsContext);
  const [messages, setMessages] = useState<(Message | ButtonMessage)[]>([]);
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

  const addMessage = async (message: Message | ButtonMessage) => {
    // if (message.isFortuneTeller) {
    //   await addFortuneTellerMessage(message);
    //   return;
    // }
    setMessages((oldMessages) => [...oldMessages.slice(0, -1), message]);
  };

  const addFortuneTellerMessage = async (text: string) => {
    const timestamp = Date.now();
    const message = new Message(true, timestamp, false, text);
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

  const addUserInput = async () =>
    new Promise<string>((resolve) => {
      const timestamp = Date.now();
      const onSubmit = (value: string) => {
        console.log("onsubmit", value);

        return resolve(value);
      };

      addMessage(new Message(false, timestamp, true, undefined, onSubmit));
    });

  const addButtons = (buttonLabels: string[]) =>
    new Promise<number>((resolve) => {
      const onClick = (number: number) => {
        return resolve(number);
      };

      const btns = buttonLabels.map((label, i) => {
        return new Btn(i, label, onClick);
      });

      addMessage(new ButtonMessage(btns));
    });

  useImperativeHandle(ref, () => ({
    addFortuneTellerMessage,
    addUserInput,
    addButtons,
  }));

  return (
    <section className={styles.outputWrapper}>
      {messages.map((message) => {
        if (message instanceof Message) {
          return <ChatMessage message={message} key={message.timestamp} />;
        } else if (message instanceof ButtonMessage) {
          return (
            <ChatActionButtons
              buttonMessage={message}
              key={message.timestamp}
            />
          );
        }
      })}
    </section>
  );
});

export default Chat;
