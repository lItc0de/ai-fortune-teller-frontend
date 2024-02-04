import { useContext, useEffect, useState } from "react";
import { StateContext } from "../stateProvider";
import NewUserStory from "../stories/newUserStory";
import { StateId } from "../constants";
import EndStory from "../stories/endStory";
import FortuneTellerStory from "../stories/fortuneTellerStory";
import NameFindingStory from "../stories/nameFindingStory";

const Stories: React.FC = () => {
  const { stateId, setStateId } = useContext(StateContext);
  const [story, setStory] = useState<string | null>(null);

  useEffect(() => {
    if (
      [
        StateId.NEW_SESSION,
        StateId.NEW_SESSION_1,
        StateId.NEW_SESSION_2,
        StateId.NEW_SESSION_3,
        StateId.NEW_SESSION_4,
      ].includes(stateId)
    ) {
      setStory("newUserStory");
    } else if (stateId === StateId.WELCOME_OLD_USER) {
      setStateId(StateId.FORTUNE_TELLER);
    } else if (stateId === StateId.FORTUNE_TELLER) {
      setStory("fortuneTellerStory");
    } else if (stateId === StateId.NAME_FINDING) {
      setStory("nameFindingStory");
    } else if (stateId === StateId.END_SESSION) {
      setStory("endStory");
    } else setStory(null);
  }, [stateId, setStateId]);

  return (
    <>
      {story === "newUserStory" && <NewUserStory />}
      {story === "nameFindingStory" && <NameFindingStory />}
      {story === "fortuneTellerStory" && <FortuneTellerStory />}
      {story === "endStory" && <EndStory />}
    </>
  );
};

export default Stories;
