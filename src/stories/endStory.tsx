import { useContext, useEffect, useRef, useState } from "react";
import { StateContext } from "../stateProvider";
import OutputWrapper from "../components/outputWrapper";
import { Message } from "../types";
import { StateId } from "../constants";

const EndStory: React.FC = () => {
  const { setStateId } = useContext(StateContext);
  const [messages, setMessages] = useState<Message[]>([]);
  const [done, setDone] = useState(false);

  const sessionMessages = useRef(new Map<string, string>());
  sessionMessages.current.set("1", "Was nice talking to you.");

  useEffect(() => {
    const messagesIterator = sessionMessages.current.entries();

    const addMessage = (text: string) => {
      const user = "Fortune teller";
      const timestamp = Date.now();

      setMessages((prefMessages) => [
        ...prefMessages,
        { text, user, timestamp },
      ]);
    };

    const nextMessage = (): boolean => {
      const messageRes = messagesIterator.next();
      if (messageRes.done) return true;
      const message = messageRes.value;
      addMessage(message[1]);

      return false;
    };

    nextMessage();

    const handleEnter = (e: KeyboardEvent) => {
      if (e.key !== "Enter") return;
      const messagesDone = nextMessage();
      if (messagesDone) {
        console.log("done");
        setDone(true);
        document.removeEventListener("keydown", handleEnter);
      }
    };
    document.addEventListener("keydown", handleEnter);

    return () => {
      document.removeEventListener("keydown", handleEnter);
      setMessages([]);
    };
  }, []);

  useEffect(() => {
    if (!done) return;

    setStateId(StateId.NO_SESSION);
  }, [done, setStateId]);

  return (
    <>
      <OutputWrapper messages={messages} />
    </>
  );
};

export default EndStory;
