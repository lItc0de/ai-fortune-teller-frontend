import { useContext, useEffect, useRef, useState } from "react";
import { StateContext, UserContext } from "../stateProvider";
import Chat, { ChatRefProps } from "../components/chat";
import { SessionStateId } from "../constants";
import { countWords } from "../utils/helpers";
import useEventIterator from "../hooks/useEventIterator";
import { GeneratorState } from "../types";

const NameFindingStory: React.FC = () => {
  const { setSessionStateId } = useContext(StateContext);
  const chatRef = useRef<ChatRefProps>(null);
  const [userName, setUserName] = useState("");
  const [done, setDone] = useState(false);
  const eventIteratorRef = useRef<AsyncGenerator<GeneratorState>>();
  const iterate = useEventIterator();

  const { updateUsername } = useContext(UserContext);

  const eventGeneratorRef = useRef(
    async function* (): AsyncGenerator<GeneratorState> {
      await chatRef.current?.addFortuneTellerMessage(
        "Before we get into the fortunes your future beholds, tell me your name so we can get to know each other better! You can speak it out loud or type it down."
      );
      yield { done: false };

      let findName = true;
      let name;
      while (findName) {
        let askForName = true;
        while (askForName) {
          name = await chatRef.current?.addUserInput();

          yield { done: false };

          if (!name || countWords(name) !== 1) {
            await chatRef.current?.addFortuneTellerMessage(
              "Oh dear, unfortunately your name got lost in the void, repeat it for me please!"
            );
          } else {
            askForName = false;
          }
        }

        await chatRef.current?.addFortuneTellerMessage(
          `So your name is ${name}? A short "yes" or "no" is enough.`
        );

        let checkIfName = true;
        let answer;
        while (checkIfName) {
          answer = await chatRef.current?.addUserInput();
          yield { done: false };

          if (answer === "no") {
            await chatRef.current?.addFortuneTellerMessage(
              "Ok, well then tell me your name again."
            );
            checkIfName = false;
          } else if (answer === "yes") {
            checkIfName = false;
            findName = false;
          } else {
            await chatRef.current?.addFortuneTellerMessage(
              'Please my dear, a short "yes" or "no" is enough.'
            );
          }
        }
      }

      await chatRef.current?.addFortuneTellerMessage(
        `Hello my dear ${name}, a beautiful name that is.`
      );

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
    setSessionStateId(SessionStateId.PROFILE_QUESTIONS);
  }, [userName, updateUsername, setSessionStateId, done]);

  return (
    <>
      <Chat ref={chatRef} />
    </>
  );
};

export default NameFindingStory;
