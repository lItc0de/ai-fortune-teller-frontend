import { useContext, useEffect, useRef, useState } from "react";
import { StateContext, UserContext } from "../stateProvider";
import Chat, { ChatRefProps } from "../components/chat";
import useEventIterator from "../hooks/useEventIterator";
import { GeneratorState } from "../types";
import { SessionStateId } from "../constants";

const ProfileQuestionStory: React.FC = () => {
  const { setSessionStateId } = useContext(StateContext);
  const chatRef = useRef<ChatRefProps>(null);
  const [done, setDone] = useState(false);
  const eventIteratorRef = useRef<AsyncGenerator<GeneratorState>>();
  const iterate = useEventIterator();
  const { user } = useContext(UserContext);
  const [buttonId, setButtonId] = useState<string>();

  const eventGeneratorRef = useRef(
    async function* (): AsyncGenerator<GeneratorState> {
      await chatRef.current?.addFortuneTellerMessage(
        `Great to meet you ${user?.name}! Now you have the option of creating a profile for more personalised predictions or you can directly go to your fortune.`
      );
      yield { done: false };

      const buttonId = await chatRef.current?.addButtons([
        "customize",
        "fortune",
      ]);

      yield { done: true, value: buttonId?.toString() };
    }
  );

  useEffect(() => {
    eventIteratorRef.current = eventGeneratorRef.current();
    iterate(eventIteratorRef.current)
      .then((buttonId) => {
        setButtonId(buttonId);
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
    if (!done) return;
    if (buttonId === "1") {
      setSessionStateId(SessionStateId.FORTUNE_TELLER);
    }
  }, [buttonId, done, setSessionStateId]);

  return (
    <>
      <Chat ref={chatRef} />
    </>
  );
};

export default ProfileQuestionStory;
