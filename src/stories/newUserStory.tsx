import { useContext, useEffect, useRef, useState } from "react";
import { StateContext } from "../stateProvider";
import Chat, { ChatRefProps } from "../components/chat";
import { AnimationStateId, SessionStateId } from "../constants";
import useEventIterator from "../hooks/useEventIterator";
import { GeneratorState } from "../types";

const NewUserStory: React.FC = () => {
  const { animationStateId, setSessionStateId } = useContext(StateContext);
  const [done, setDone] = useState(false);
  const eventIteratorRef = useRef<AsyncGenerator<GeneratorState>>();
  const chatRef = useRef<ChatRefProps>(null);
  const iterate = useEventIterator();

  const eventGeneratorRef = useRef(
    async function* (): AsyncGenerator<GeneratorState> {
      await chatRef.current?.addMessageFortuneTeller(
        "Welcome to the AI Fortune Teller! I see you want to take a glimpse in your future. Using my AI magic and sprinkling a bit of data from you, my intuitive powers will reveal what  lies ahead of you."
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
    if (animationStateId !== AnimationStateId.NEW_SESSION_4) return;

    setSessionStateId(SessionStateId.NAME_FINDING);
  }, [done, animationStateId, setSessionStateId]);

  return (
    <>
      <Chat ref={chatRef} />
    </>
  );
};

export default NewUserStory;
