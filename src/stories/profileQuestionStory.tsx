import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ChatElementsContext } from "../providers/chatElementsProvider";
import ChatMessageModel from "../components/chat/chatMessage.model";
import ChatOptionsModel, {
  ChatOption,
} from "../components/chat/chatOptions.model";
import { StateContext } from "../providers/stateProvider";
import { SessionStateId } from "../constants";
import { UserContext } from "../providers/userProvider";

import img1 from "../media/img-1.jpeg";
import img2 from "../media/img-2.jpeg";
import img3 from "../media/img-3.jpeg";

const ProfileQuestionStory: React.FC = () => {
  const { addChatElement, clearChatElements } = useContext(ChatElementsContext);
  const { setSessionStateId } = useContext(StateContext);
  const { updateProfileQuestionsSelection } = useContext(UserContext);

  const [done, setDone] = useState(false);
  const [selection, setSelection] = useState<string[]>([]);
  const eventIteratorRef = useRef<Generator<void>>();

  const options1: ChatOption[] = [
    { id: "optimistic", text: "Sunrise" },
    { id: "mysterious", text: "Midnight" },
    { id: "reflective", text: "Sunset" },
  ];

  const options2: ChatOption[] = [
    { id: "free-spirited", text: "Ocean" },
    { id: "grounded", text: "Forest" },
    { id: "independent", text: "Desert" },
  ];

  const options3: ChatOption[] = [
    { id: "peaceful", imgSrc: img1 },
    { id: "creative", imgSrc: img2 },
    { id: "intriguing", imgSrc: img3 },
  ];

  const options4: ChatOption[] = [
    { id: "fear-of-loosing-control", text: "Experiencing free fall" },
    { id: "need-for-scceptance", text: "Being naked infront of other people" },
    {
      id: "emotional-connection-to-the-past",
      text: "Meeting deceased loved ones",
    },
  ];

  const options5: ChatOption[] = [
    { id: "traditional", text: "Classical" },
    { id: "energetic", text: "Electronic" },
    { id: "extroverted", text: "Pop" },
  ];

  const options6: ChatOption[] = [
    { id: "forward-looking", text: "Sun" },
    { id: "intuitive", text: "Moon" },
    { id: "ambitious", text: "Star" },
  ];

  const options7: ChatOption[] = [
    { id: "adventurous", text: "Flying" },
    { id: "controlling", text: "Time manipulation" },
    { id: "very-mysterious", text: "Telekinesis" },
  ];

  const handleSelect = useCallback((id?: string) => {
    if (id) setSelection((currSelection) => [...currSelection, id]);

    const res = eventIteratorRef.current?.next();
    if (res && res.done) setDone(true);
  }, []);

  const handleNext = useCallback(() => {
    const res = eventIteratorRef.current?.next();
    if (res && res.done) setDone(true);
  }, []);

  const eventGeneratorRef = useRef(function* (): Generator<void> {
    yield addChatElement(
      new ChatMessageModel(
        true,
        `So you want a personal reading I see!
        Let's delve into my little questionnaire for you shall we? The questions I prepared for you will reveal all what's there to know.`,
        false,
        handleNext
      )
    );

    yield addChatElement(
      new ChatOptionsModel(
        true,
        `When do you feel most energised during the day?`,
        options1,
        false,
        handleSelect
      )
    );

    yield addChatElement(
      new ChatOptionsModel(
        true,
        `Which natural element do you feel most connected to?`,
        options2,
        false,
        handleSelect
      )
    );

    yield addChatElement(
      new ChatOptionsModel(
        true,
        `Select an image that represents your current state of mind:`,
        options3,
        false,
        handleSelect
      )
    );

    yield addChatElement(
      new ChatOptionsModel(
        true,
        `Pick a dream element without providing details:`,
        options4,
        false,
        handleSelect
      )
    );

    yield addChatElement(
      new ChatOptionsModel(
        true,
        `Select a musical genre that resonates with you:`,
        options5,
        false,
        handleSelect
      )
    );

    yield addChatElement(
      new ChatOptionsModel(
        true,
        `Choose a celestial body that you feel most connected to:`,
        options6,
        false,
        handleSelect
      )
    );

    yield addChatElement(
      new ChatOptionsModel(
        true,
        `What type of superpower would you pick?`,
        options7,
        false,
        handleSelect
      )
    );

    yield addChatElement(
      new ChatMessageModel(
        true,
        `Thanks for your answers, let's begin!`,
        false,
        handleNext,
        true
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
    if (!done || selection.length === 0) return;
    updateProfileQuestionsSelection(selection);
    clearChatElements();
    setSessionStateId(SessionStateId.TOPIC_SELECTION);
  }, [
    done,
    selection,
    setSessionStateId,
    updateProfileQuestionsSelection,
    clearChatElements,
  ]);

  return <></>;
};

export default ProfileQuestionStory;
