import { useContext, useEffect, useRef, useState } from "react";
import Socket from "../socket";
// import SocketMessage, { SocketMessageType } from "../utils/socketMessage";
import { ChatElementsContext } from "../providers/chatElementsProvider";
import ChatMessageModel from "../components/chat/chatMessage.model";
import ChatInputModel from "../components/chat/chatInput.model";
import { sleep } from "../utils/helpers";

const FortuneTellerStory: React.FC = () => {
  const { addChatElement } = useContext(ChatElementsContext);

  const [done, setDone] = useState(false);
  const socketRef = useRef<Socket>();
  const eventIteratorRef = useRef<Generator<void>>();

  const handleInput = (value?: string) => {
    eventIteratorRef.current?.next();
    eventIteratorRef.current?.next(value);
  };

  const handleNext = () => {
    const res = eventIteratorRef.current?.next();
    if (res && res.done) setDone(true);
  };

  const sendPrompt = async (prompt: string) => {
    await sleep(1000);
    // eventIteratorRef.current?.next();
    eventIteratorRef.current?.next(`--> ${prompt}`);
  };

  const eventGeneratorRef = useRef(function* (): Generator<void> {
    yield addChatElement(
      new ChatMessageModel(
        true,
        `I'm ready to to look into my glassball to tell you everything you wish to know. So go ahead!`,
        false,
        handleNext
      )
    );

    while (true) {
      yield addChatElement(new ChatInputModel(true, false, handleInput));
      const prompt = yield;

      if (prompt && typeof prompt === "string") {
        sendPrompt(prompt);
        const answer = yield;
        if (answer && typeof answer === "string") {
          yield addChatElement(
            new ChatMessageModel(true, answer, false, handleNext)
          );
        }
        // await chatRef.current?.addFortuneTellerMessage(question);
        // const response = await socketRef.current?.send(
        //   new SocketMessage(SocketMessageType.PROMPT, question, user?.name)
        // );
        // if (
        //   response &&
        //   response.type === SocketMessageType.BOT &&
        //   response.prompt
        // ) {
        //   await chatRef.current?.addFortuneTellerMessage(response.prompt);
        // } else {
        // }
      }
    }
  });

  useEffect(() => {
    eventIteratorRef.current = eventGeneratorRef.current();
    const iterator = eventIteratorRef.current;
    iterator.next();

    return () => {
      iterator.return(undefined);
    };
  }, []);

  useEffect(() => {
    socketRef.current = new Socket();
  }, []);

  useEffect(() => {
    if (done) console.log("done");
  }, [done]);

  return <></>;
};

export default FortuneTellerStory;
