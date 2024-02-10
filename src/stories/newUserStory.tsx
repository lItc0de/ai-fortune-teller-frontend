import { useContext, useEffect, useRef, useState } from "react";
import { AnimationStateId, SessionStateId } from "../constants";
import { StateContext } from "../providers/stateProvider";
import { ChatElementsContext } from "../providers/chatElementsProvider";
import ChatMessageModel from "../components/chat/chatMessage.model";

const NewUserStory: React.FC = () => {
  const { animationStateId, setSessionStateId } = useContext(StateContext);
  const { addChatElement } = useContext(ChatElementsContext);
  const [done, setDone] = useState(false);
  const eventIteratorRef = useRef<Generator<void>>();

  const handleNext = () => {
    const res = eventIteratorRef.current?.next();
    if (res && res.done) setDone(true);
  };

  const eventGeneratorRef = useRef(function* (): Generator<void> {
    yield addChatElement(
      new ChatMessageModel(
        true,
        `Welcome to the AI Fortune Teller! I see you want to take a glimpse in your future. Using my AI magic and sprinkling a bit of data from you, my intuitive powers will reveal what  lies ahead of you.`,
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
    if (!done) return;
    if (animationStateId !== AnimationStateId.NEW_SESSION_4) return;

    setSessionStateId(SessionStateId.NAME_FINDING);
  }, [done, animationStateId, setSessionStateId]);

  return <></>;
};

export default NewUserStory;
