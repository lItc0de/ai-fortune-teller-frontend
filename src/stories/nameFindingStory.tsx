import { useContext, useEffect, useRef, useState } from "react";
import { StateContext, UserContext } from "../stateProvider";
import OutputWrapper, {
  OutputWrapperRefProps,
} from "../components/outputWrapper";
import { FORTUNE_TELLER_USER, SessionStateId } from "../constants";
import { countWords } from "../utils/helpers";
import Input, { RefProps } from "../components/input";
import useEventIterator from "../hooks/useEventIterator";
import { GeneratorState } from "../types";

const NameFindingStory: React.FC = () => {
  const { setSessionStateId } = useContext(StateContext);
  const inputRef = useRef<RefProps>(null);
  const outputWrapperRef = useRef<OutputWrapperRefProps>(null);
  const [userName, setUserName] = useState("");
  const [done, setDone] = useState(false);
  const eventIteratorRef = useRef<AsyncGenerator<GeneratorState>>();
  const iterate = useEventIterator();

  const { updateUsername } = useContext(UserContext);

  const addMessage = async (text: string) => {
    const user = FORTUNE_TELLER_USER;
    const timestamp = Date.now();

    await outputWrapperRef.current?.addMessage({ text, user, timestamp });
  };

  const eventGeneratorRef = useRef(
    async function* (): AsyncGenerator<GeneratorState> {
      await addMessage("All I ask of you is to speak your name!");
      yield { done: false };

      let findName = true;
      let name;
      while (findName) {
        let askForName = true;
        while (askForName) {
          name = await inputRef.current?.waitForInput();

          yield { done: false };

          if (!name || countWords(name) !== 1) {
            await addMessage(
              "Oh dear, unfortunately your name got lost in the void, repeat it for me please!"
            );
          } else {
            askForName = false;
          }
        }

        await addMessage(
          `So your name is ${name}? A short "yes" or "no" is enough.`
        );

        let checkIfName = true;
        let answer;
        while (checkIfName) {
          answer = await inputRef.current?.waitForInput();
          yield { done: false };

          if (answer === "no") {
            await addMessage("Ok, well then tell me your name again.");
            checkIfName = false;
          } else if (answer === "yes") {
            checkIfName = false;
            findName = false;
          } else {
            await addMessage(
              'Please my dear, a short "yes" or "no" is enough.'
            );
          }
        }
      }

      await addMessage(`Hello my dear ${name}, a beautiful name that is.`);

      yield { done: true, value: name };
    }
  );

  useEffect(() => {
    eventIteratorRef.current = eventGeneratorRef.current();
    iterate(eventIteratorRef.current)
      .then((name) => {
        if (name) setUserName(name);
        setDone(true);
      })
      .catch((error) => {
        if (error instanceof Error) {
          if (error.message === "Aborted") return;
        }
        throw error;
      });
    return () => {};
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!userName || !done) return;

    updateUsername(userName);
    setSessionStateId(SessionStateId.FORTUNE_TELLER);
  }, [userName, updateUsername, setSessionStateId, done]);

  return (
    <>
      <OutputWrapper ref={outputWrapperRef} />
      <Input ref={inputRef} />
    </>
  );
};

export default NameFindingStory;
