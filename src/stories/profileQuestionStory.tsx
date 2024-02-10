import { useContext, useEffect, useRef, useState } from "react";
import { SessionStateId } from "../constants";
import { StateContext } from "../providers/stateProvider";
import { UserContext } from "../providers/userProvider";
import { ChatElementsContext } from "../providers/chatElementsProvider";
import ChatMessageModel from "../components/chat/chatMessage.model";
import ChatBtnsModel from "../components/chat/chatBtns.model";

const ProfileQuestionStory: React.FC = () => {
  const { setSessionStateId } = useContext(StateContext);
  const { user } = useContext(UserContext);
  const { addChatElement } = useContext(ChatElementsContext);

  const [done, setDone] = useState(false);
  const eventIteratorRef = useRef<Generator<void>>();
  const [buttonId, setButtonId] = useState<string>();

  const handleNext = (value?: string) => {
    if (value) setButtonId(value);

    const res = eventIteratorRef.current?.next();
    if (res && res.done) setDone(true);
  };

  const eventGeneratorRef = useRef(function* (): Generator<void> {
    yield addChatElement(
      new ChatMessageModel(
        true,
        `Great to meet you ${user?.name}! Now you have the option of creating a profile for more personalised predictions or you can directly go to your fortune.`,
        false,
        handleNext
      )
    );

    yield addChatElement(
      new ChatBtnsModel(true, ["customize", "fortune"], false, handleNext)
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
    if (buttonId === "1") {
      setSessionStateId(SessionStateId.FORTUNE_TELLER);
    }
  }, [buttonId, done, setSessionStateId]);

  return <></>;
};

export default ProfileQuestionStory;
