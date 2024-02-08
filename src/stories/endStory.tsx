import { useContext, useEffect, useRef, useState } from "react";
import { StateContext } from "../stateProvider";
import OutputWrapper, {
  OutputWrapperRefProps,
} from "../components/outputWrapper";
import { FORTUNE_TELLER_USER, SessionStateId } from "../constants";
import { GeneratorState } from "../types";
import useEventIterator from "../hooks/useEventIterator";

const EndStory: React.FC = () => {
  const { setSessionStateId } = useContext(StateContext);
  const [done, setDone] = useState(false);
  const outputWrapperRef = useRef<OutputWrapperRefProps>(null);
  const eventIteratorRef = useRef<AsyncGenerator<GeneratorState>>();
  const iterate = useEventIterator();

  const addMessage = async (text: string) => {
    const user = FORTUNE_TELLER_USER;
    const timestamp = Date.now();

    await outputWrapperRef.current?.addMessage({ text, user, timestamp });
  };

  const eventGeneratorRef = useRef(
    async function* (): AsyncGenerator<GeneratorState> {
      await addMessage("Was nice talking to you!");
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
      <OutputWrapper ref={outputWrapperRef} />
    </>
  );
};

export default EndStory;
