import { useContext, useEffect, useRef, useState } from "react";
import { StateContext, UserContext } from "../stateProvider";
import OutputWrapper from "../components/outputWrapper";
import { Message } from "../types";
import { SessionStateId } from "../constants";
import { countWords, waitForEnter } from "../utils/helpers";
import Input, { RefProps } from "../components/input";

const NameFindingStory: React.FC = () => {
  const { setSessionStateId } = useContext(StateContext);
  const inputRef = useRef<RefProps>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userName, setUserName] = useState("");
  const [done, setDone] = useState(false);
  const eventIteratorRef = useRef<AsyncGenerator<string | undefined>>();

  const { updateUsername } = useContext(UserContext);

  const addMessage = (text: string) => {
    const user = "Fortune teller";
    const timestamp = Date.now();

    setMessages((prefMessages) => [...prefMessages, { text, user, timestamp }]);
  };

  const eventGeneratorRef = useRef(async function* (): AsyncGenerator<
    string | undefined
  > {
    addMessage("All I ask of you is to speak your name!");
    await waitForEnter();
    yield;

    let findName = true;
    let name;
    while (findName) {
      let askForName = true;
      while (askForName) {
        name = await inputRef.current?.waitForInput();
        console.log("name:", name);

        yield;

        if (!name || countWords(name) !== 1) {
          addMessage(
            "Oh dear, unfortunately your name got lost in the void, repeat it for me please!"
          );
          await waitForEnter();
        } else {
          askForName = false;
        }
      }

      addMessage(`So your name is ${name}? A short "yes" or "no" is enough.`);

      let checkIfName = true;
      let answer;
      while (checkIfName) {
        answer = await inputRef.current?.waitForInput();
        yield;

        if (answer === "no") {
          addMessage("Ok, well then tell me your name again.");
          checkIfName = false;
        } else if (answer === "yes") {
          checkIfName = false;
          findName = false;
        } else {
          addMessage('Please my dear, a short "yes" or "no" is enough.');
        }
      }
    }

    addMessage(`Hello my dear ${name}, a beautiful name that is.`);

    yield name;
  });

  useEffect(() => {
    eventIteratorRef.current = eventGeneratorRef.current();
    console.log("useEffect called");

    const iterate = async () => {
      if (!eventIteratorRef.current) return;
      for await (const event of eventIteratorRef.current) {
        const name = event;
        if (name) setUserName(name);
      }
      setDone(true);
    };

    iterate();

    return () => {
      setMessages([]);
    };
  }, []);

  useEffect(() => {
    if (!userName || !done) return;

    updateUsername(userName);
    setSessionStateId(SessionStateId.FORTUNE_TELLER);
  }, [userName, updateUsername, setSessionStateId, done]);

  return (
    <>
      <OutputWrapper messages={messages} />
      <Input ref={inputRef} />
    </>
  );
};

export default NameFindingStory;
