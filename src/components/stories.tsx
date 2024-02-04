import { useContext, useEffect } from "react";
import { StateContext } from "../stateProvider";
import NewUserStory from "../stories/newUserStory";
import { AnimationStateId, SessionStateId } from "../constants";
import EndStory from "../stories/endStory";
import FortuneTellerStory from "../stories/fortuneTellerStory";
import NameFindingStory from "../stories/nameFindingStory";

const Stories: React.FC = () => {
  const { sessionStateId, setSessionStateId, setAnimationStateId } =
    useContext(StateContext);

  useEffect(() => {
    switch (sessionStateId) {
      case SessionStateId.NEW_SESSION:
        setAnimationStateId(AnimationStateId.NEW_SESSION_1);
        break;
      case SessionStateId.WELCOME_OLD_USER:
        setSessionStateId(SessionStateId.FORTUNE_TELLER);
        break;

      case SessionStateId.FORTUNE_TELLER:
        setAnimationStateId(AnimationStateId.FORTUNE_TELLER);
        break;

      case SessionStateId.NAME_FINDING:
        setAnimationStateId(AnimationStateId.FORTUNE_TELLER);
        break;

      case SessionStateId.END_SESSION:
        setAnimationStateId(AnimationStateId.IDLE);
        break;

      default:
        setAnimationStateId(AnimationStateId.IDLE);
        break;
    }
  }, [sessionStateId, setSessionStateId, setAnimationStateId]);

  return (
    <>
      {sessionStateId === SessionStateId.NEW_SESSION && <NewUserStory />}
      {sessionStateId === SessionStateId.NAME_FINDING && <NameFindingStory />}
      {sessionStateId === SessionStateId.FORTUNE_TELLER && (
        <FortuneTellerStory />
      )}
      {sessionStateId === SessionStateId.END_SESSION && <EndStory />}
    </>
  );
};

export default Stories;
