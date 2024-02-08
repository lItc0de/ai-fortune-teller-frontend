import { useContext, useEffect, useRef, useState } from "react";
import { StateContext } from "../stateProvider";
import OutputWrapper, {
  OutputWrapperRefProps,
} from "../components/outputWrapper";
import {
  AnimationStateId,
  FORTUNE_TELLER_USER,
  SessionStateId,
} from "../constants";
import useEventIterator from "../hooks/useEventIterator";
import { GeneratorState } from "../types";

const NewUserStory: React.FC = () => {
  const { animationStateId, setSessionStateId } = useContext(StateContext);
  const [done, setDone] = useState(false);
  const eventIteratorRef = useRef<AsyncGenerator<GeneratorState>>();
  const outputWrapperRef = useRef<OutputWrapperRefProps>(null);
  const iterate = useEventIterator();

  const addMessage = async (text: string) => {
    const user = FORTUNE_TELLER_USER;
    const timestamp = Date.now();

    await outputWrapperRef.current?.addMessage({ text, user, timestamp });
  };

  const eventGeneratorRef = useRef(
    async function* (): AsyncGenerator<GeneratorState> {
      await addMessage(
        "Welcome, welcome. What a pleasure it is to see that fates have crossed our paths as two souls keen on the mystic arts of fortune telling."
      );
      yield { done: false };

      await addMessage(
        "That sparkle in your eyes carries the burden of both curiosity and mockery, so let us embark on a journey across the spiritual realms with the help of some… uh… artificial intelligence."
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
      <OutputWrapper ref={outputWrapperRef} />
    </>
  );
};

export default NewUserStory;
