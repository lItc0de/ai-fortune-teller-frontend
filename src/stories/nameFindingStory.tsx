import { useContext, useEffect, useRef, useState } from "react";
import { SessionStateId } from "../constants";
import { countWords } from "../utils/helpers";
import { StateContext } from "../providers/stateProvider";
import { UserContext } from "../providers/userProvider";
import { ChatElementsContext } from "../providers/chatElementsProvider";
import ChatMessageModel from "../components/chat/chatMessage.model";
import ChatInputModel from "../components/chat/chatInput.model";

const NameFindingStory: React.FC = () => {
  const { setSessionStateId } = useContext(StateContext);
  const { updateUsername } = useContext(UserContext);
  const { addChatElement } = useContext(ChatElementsContext);

  const [userName, setUserName] = useState("");
  const [done, setDone] = useState(false);
  const eventIteratorRef = useRef<Generator<void>>();

  const handleInput = (value?: string) => {
    console.log("handleInput", value);

    eventIteratorRef.current?.next();
    eventIteratorRef.current?.next(value);
  };

  const handleNext = () => {
    const res = eventIteratorRef.current?.next();

    if (res && res.done) setDone(true);
  };

  const eventGeneratorRef = useRef(function* (): Generator<void> {
    yield addChatElement(
      new ChatMessageModel(
        true,
        `Before we get into the fortunes your future beholds, tell me your name so we can get to know each other better! You can speak it out loud or type it down.`,
        false,
        handleNext
      )
    );

    let findName = true;
    let name;
    while (findName) {
      let askForName = true;
      while (askForName) {
        yield addChatElement(new ChatInputModel(true, false, handleInput));
        name = yield;
        console.log("name:", name);

        if (typeof name !== "string") continue;

        if (!name || countWords(name) !== 1) {
          yield addChatElement(
            new ChatMessageModel(
              true,
              `Oh dear, unfortunately your name got lost in the void, repeat it for me please!`,
              false,
              handleNext
            )
          );
        } else {
          askForName = false;
        }
      }

      yield addChatElement(
        new ChatMessageModel(
          true,
          `So your name is ${name}? A short "yes" or "no" is enough.`,
          false,
          handleNext
        )
      );

      let checkIfName = true;
      let answer;
      while (checkIfName) {
        yield addChatElement(new ChatInputModel(true, false, handleInput));
        answer = yield;

        if (answer === "no") {
          yield addChatElement(
            new ChatMessageModel(
              true,
              `Ok, well then tell me your name again.`,
              false,
              handleNext
            )
          );
          checkIfName = false;
        } else if (answer === "yes") {
          checkIfName = false;
          findName = false;
        } else {
          yield addChatElement(
            new ChatMessageModel(
              true,
              `Please my dear, a short "yes" or "no" is enough.`,
              false,
              handleNext
            )
          );
        }
      }
    }

    if (name && typeof name === "string") setUserName(name);

    yield addChatElement(
      new ChatMessageModel(
        true,
        `Hello my dear ${name}, a beautiful name that is.`,
        false,
        handleNext
      )
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
    if (!userName || !done) return;

    updateUsername(userName);
    setSessionStateId(SessionStateId.PROFILE_QUESTIONS);
  }, [userName, updateUsername, setSessionStateId, done]);

  return <></>;
};

export default NameFindingStory;
