import { useContext, useEffect, useRef, useState } from "react";
import { ChatElementsContext } from "../providers/chatElementsProvider";
import ChatMessageModel from "../components/chat/chatMessage.model";
import ChatInputModel from "../components/chat/chatInput.model";
import useChatBot from "../hooks/useChatBot";
import { StateContext } from "../providers/stateProvider";

const FortuneTellerStory: React.FC = () => {
  const { addChatElement } = useContext(ChatElementsContext);
  const { topic } = useContext(StateContext);
  const { sendUserMessage } = useChatBot();

  const [done, setDone] = useState(false);
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
    const serverMessage = await sendUserMessage(prompt);

    eventIteratorRef.current?.next(serverMessage.content);
  };

  const eventGeneratorRef = useRef(function* (): Generator<void> {
    yield addChatElement(
      new ChatMessageModel(
        true,
        `I'm ready to look into my glassball to tell you everything you wish to know. So go ahead!`,
        false,
        handleNext,
        false,
        topic
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
            new ChatMessageModel(true, answer, false, handleNext, false, topic)
          );
        }
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
    if (done) console.log("done");
  }, [done]);

  return <></>;
};

export default FortuneTellerStory;
