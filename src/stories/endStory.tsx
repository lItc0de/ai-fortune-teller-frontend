import { useContext, useEffect, useRef, useState } from "react";
import { SessionStateId } from "../constants";
import { StateContext } from "../providers/stateProvider";
import { ChatElementsContext } from "../providers/chatElementsProvider";
import ChatMessageModel from "../components/chat/chatMessage.model";
import { sleep } from "../utils/helpers";

const EndStory: React.FC = () => {
  const { setSessionStateId } = useContext(StateContext);
  const { addChatElement } = useContext(ChatElementsContext);

  const [done, setDone] = useState(false);
  const eventIteratorRef = useRef<Generator<void>>();

  const handleNext = async () => {
    const res = eventIteratorRef.current?.next();
    if (res && res.done) {
      await sleep(3000);
      setDone(true);
    }
  };

  const eventGeneratorRef = useRef(function* (): Generator<void> {
    yield addChatElement(
      new ChatMessageModel(true, `Was nice talking to you!`, false, handleNext)
    );
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
    if (!done) return;

    setSessionStateId(SessionStateId.NO_SESSION);
  }, [done, setSessionStateId]);

  return <></>;
};

export default EndStory;
