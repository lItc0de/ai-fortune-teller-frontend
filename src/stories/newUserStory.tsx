import { useContext, useEffect, useRef, useState } from "react";
import { StateContext } from "../stateProvider";
import OutputWrapper from "../components/outputWrapper";
import { GeneratorState, Message } from "../types";
import { StateId } from "../constants";
import { waitForEnter } from "../utils/helpers";

const NewUserStory: React.FC = () => {
  const { stateId, setStateId } = useContext(StateContext);
  const [messages, setMessages] = useState<Message[]>([]);
  const [done, setDone] = useState(false);
  const eventIteratorRef = useRef<AsyncGenerator<GeneratorState>>();

  const addMessage = (text: string) => {
    const user = "Fortune teller";
    const timestamp = Date.now();

    setMessages((prefMessages) => [...prefMessages, { text, user, timestamp }]);
  };

  const eventGeneratorRef = useRef(
    async function* (): AsyncGenerator<GeneratorState> {
      addMessage(
        "Welcome, welcome. What a pleasure it is to see that fates have crossed our paths as two souls keen on the mystic arts of fortune telling."
      );
      await waitForEnter();
      yield { done: false };

      addMessage(
        "That sparkle in your eyes carries the burden of both curiosity and mockery, so let us embark on a journey across the spiritual realms with the help of some… uh… artificial intelligence."
      );
      await waitForEnter();
      yield { done: true };
    }
  );

  useEffect(() => {
    eventIteratorRef.current = eventGeneratorRef.current();

    const iterate = async () => {
      if (!eventIteratorRef.current) return;
      for await (const event of eventIteratorRef.current) {
        console.log("lol");

        setDone(event.done);
      }
    };

    iterate();

    return () => {
      setMessages([]);
    };
  }, []);

  useEffect(() => {
    if (!done) return;
    if (stateId !== StateId.NEW_SESSION_4) return;

    setStateId(StateId.NAME_FINDING);
  }, [done, stateId, setStateId]);

  return (
    <>
      <OutputWrapper messages={messages} />
    </>
  );
};

export default NewUserStory;
