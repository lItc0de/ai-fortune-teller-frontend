import { useContext, useEffect, useRef, useState } from "react";
import { StateContext } from "../stateProvider";
import Chat, { ChatRefProps } from "../components/chat";
import { SessionStateId } from "../constants";
import { GeneratorState } from "../types";
import useEventIterator from "../hooks/useEventIterator";

const EndStory: React.FC = () => {
  const { setSessionStateId } = useContext(StateContext);
  const [done, setDone] = useState(false);
  const chatRef = useRef<ChatRefProps>(null);
  const eventIteratorRef = useRef<AsyncGenerator<GeneratorState>>();
  const iterate = useEventIterator();

  const eventGeneratorRef = useRef(
    async function* (): AsyncGenerator<GeneratorState> {
      await chatRef.current?.addMessageFortuneTeller(
        "Was nice talking to you!"
      );
      yield { done: true };
    }
  );

  useEffect(() => {
    eventIteratorRef.current = eventGeneratorRef.current();
    iterate(eventIteratorRef.current)
      .then(() => setDone(true))
      .catch((error) => {
        if (error instanceof Error) {
          if (error.message === "Aborted") return;
        }
        throw error;
      });
    return () => {};
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!done) return;

    setSessionStateId(SessionStateId.NO_SESSION);
  }, [done, setSessionStateId]);

  return (
    <>
      <Chat ref={chatRef} />
    </>
  );
};

export default EndStory;
