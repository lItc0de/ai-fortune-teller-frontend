import { useContext, useEffect, useRef } from "react";
import OutputWrapper, {
  OutputWrapperRefProps,
} from "../components/outputWrapper";
import Input, { RefProps } from "../components/input";
import Socket from "../socket";
import SocketMessage, { SocketMessageType } from "../utils/socketMessage";
import { UserContext } from "../stateProvider";
import { FORTUNE_TELLER_USER } from "../constants";
import useEventIterator from "../hooks/useEventIterator";
import { GeneratorState } from "../types";

const FortuneTellerStory: React.FC = () => {
  const { user } = useContext(UserContext);
  const inputRef = useRef<RefProps>(null);
  const outputWrapperRef = useRef<OutputWrapperRefProps>(null);
  const socketRef = useRef<Socket>();
  const eventIteratorRef = useRef<AsyncGenerator<GeneratorState>>();
  const iterate = useEventIterator();

  const addMessage = async (text: string) => {
    const user = FORTUNE_TELLER_USER;
    const timestamp = Date.now();

    await outputWrapperRef.current?.addMessage({ text, user, timestamp });
  };

  const eventGeneratorRef = useRef(
    async function* (): AsyncGenerator<GeneratorState> {
      addMessage(
        "I'm ready to to look into my glassball to tell you everything you wish to know. So go ahead!"
      );
      yield { done: false };

      while (true) {
        const question = await inputRef.current?.waitForInput();

        if (question) {
          addMessage(question);
          const response = await socketRef.current?.send(
            new SocketMessage(SocketMessageType.PROMPT, question, user?.name)
          );
          if (
            response &&
            response.type === SocketMessageType.BOT &&
            response.prompt
          ) {
            addMessage(response.prompt);
          } else {
            console.log(response);
          }
        }
        yield { done: true };
      }
    }
  );

  useEffect(() => {
    eventIteratorRef.current = eventGeneratorRef.current();
    iterate(eventIteratorRef.current).catch((error) => {
      if (error instanceof Error) {
        if (error.message === "Aborted") return;
      }
      throw error;
    });
    return () => {};
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    socketRef.current = new Socket();
  }, []);

  return (
    <>
      <OutputWrapper ref={outputWrapperRef} />
      <Input ref={inputRef} />
    </>
  );
};

export default FortuneTellerStory;
