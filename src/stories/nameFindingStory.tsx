import { useContext, useEffect, useRef, useState } from "react";
import { SessionStateId } from "../constants";
import { countWords } from "../utils/helpers";
import { StateContext } from "../providers/stateProvider";
import { UserContext } from "../providers/userProvider";
import { ChatElementsContext } from "../providers/chatElementsProvider";
import ChatMessageModel from "../components/chat/chatMessage.model";
import ChatInputModel from "../components/chat/chatInput.model";
import ChatBtnsModel from "../components/chat/chatBtns.model";

const NameFindingStory: React.FC = () => {
  const { setSessionStateId } = useContext(StateContext);
  const { updateUsername } = useContext(UserContext);
  const { addChatElement, clearChatElements } = useContext(ChatElementsContext);

  const [done, setDone] = useState(false);
  const [buttonId, setButtonId] = useState<string>();
  const eventIteratorRef = useRef<Generator<void>>();

  const handleInput = (value?: string) => {
    eventIteratorRef.current?.next();
    eventIteratorRef.current?.next(value);
  };

  const handleNext = () => {
    const res = eventIteratorRef.current?.next();

    if (res && res.done) setDone(true);
  };

  const handleBtn = (value?: string) => {
    if (value) setButtonId(value);

    const res = eventIteratorRef.current?.next();
    if (res && res.done) setDone(true);
  };

  const eventGeneratorRef = useRef(function* (): Generator<void> {
    yield addChatElement(
      new ChatMessageModel(
        true,
        `Before we get into the fortunes your future beholds, tell me your name so we can get to know each other better!`,
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

    if (name && typeof name === "string") updateUsername(name);

    yield addChatElement(
      new ChatMessageModel(
        true,
        `Great to meet you ${name}! Now you have the option of creating a profile for more personalised predictions or you can directly go to your fortune.`,
        false,
        handleNext
      )
    );

    yield addChatElement(
      new ChatBtnsModel(true, ["customize", "fortune"], false, handleBtn)
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
    if (!done) return;
    clearChatElements();
    if (buttonId === "1") {
      setSessionStateId(SessionStateId.PROFILE_QUESTIONS);
    } else if (buttonId === "2") {
      setSessionStateId(SessionStateId.TOPIC_SELECTION);
    }
  }, [buttonId, done, setSessionStateId, clearChatElements]);

  return <></>;
};

export default NameFindingStory;
