import { useContext, useEffect, useRef, useState } from "react";
import OutputWrapper from "../components/outputWrapper";
import { Message } from "../types";
import { waitForEnter } from "../utils/helpers";
import Input, { RefProps } from "../components/input";
import Socket from "../socket";
import SocketMessage, { SocketMessageType } from "../utils/socketMessage";
import { UserContext } from "../stateProvider";

const FortuneTellerStory: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { user } = useContext(UserContext);
  const inputRef = useRef<RefProps>(null);
  const socketRef = useRef<Socket>();
  const eventIteratorRef = useRef<AsyncGenerator<undefined>>();

  const addMessage = (text: string) => {
    const aiUser = "Fortune teller";
    const timestamp = Date.now();

    setMessages((prefMessages) => [
      ...prefMessages,
      { text, user: aiUser, timestamp },
    ]);
  };

  const eventGeneratorRef = useRef(
    async function* (): AsyncGenerator<undefined> {
      addMessage(
        "I'm ready to to look into my glassball to tell you everything you wish to know. So go ahead!"
      );
      await waitForEnter();
      yield;

      while (true) {
        const question = await inputRef.current?.waitForInput();

        if (question) {
          addMessage(question);
          const response = await socketRef.current.send(
            new SocketMessage(SocketMessageType.PROMPT, question, user?.name)
          );
          if (response.type === SocketMessageType.BOT && response.prompt) {
            addMessage(response.prompt);
          } else {
            console.log(response);
          }
        }

        await waitForEnter();
        yield;
      }
    }
  );

  useEffect(() => {
    eventIteratorRef.current = eventGeneratorRef.current();

    const iterate = async () => {
      if (!eventIteratorRef.current) return;
      for await (const event of eventIteratorRef.current) {
        console.log("iterate", event);
      }
    };

    iterate();

    return () => {
      setMessages([]);
    };
  }, []);

  useEffect(() => {
    socketRef.current = new Socket();
  }, []);

  return (
    <>
      <OutputWrapper messages={messages} />
      <Input ref={inputRef} />
    </>
  );
};

export default FortuneTellerStory;
