import { useContext, useEffect, useRef } from "react";
import Chat, { ChatRefProps } from "../components/chat";
import Socket from "../socket";
import SocketMessage, { SocketMessageType } from "../utils/socketMessage";
import { UserContext } from "../stateProvider";
import useEventIterator from "../hooks/useEventIterator";
import { GeneratorState } from "../types";

const FortuneTellerStory: React.FC = () => {
  const { user } = useContext(UserContext);
  const chatRef = useRef<ChatRefProps>(null);
  const socketRef = useRef<Socket>();
  const eventIteratorRef = useRef<AsyncGenerator<GeneratorState>>();
  const iterate = useEventIterator();

  const eventGeneratorRef = useRef(
    async function* (): AsyncGenerator<GeneratorState> {
      await chatRef.current?.addFortuneTellerMessage(
        "I'm ready to to look into my glassball to tell you everything you wish to know. So go ahead!"
      );
      yield { done: false };

      while (true) {
        const question = await chatRef.current?.addUserInput();

        if (question) {
          await chatRef.current?.addFortuneTellerMessage(question);
          const response = await socketRef.current?.send(
            new SocketMessage(SocketMessageType.PROMPT, question, user?.name)
          );
          if (
            response &&
            response.type === SocketMessageType.BOT &&
            response.prompt
          ) {
            await chatRef.current?.addFortuneTellerMessage(response.prompt);
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
      <Chat ref={chatRef} />
    </>
  );
};

export default FortuneTellerStory;
