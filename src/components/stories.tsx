import { useContext, useEffect, useState } from "react";
import NewUserStory from "../stories/newUserStory";
import { AnimationStateId, SessionStateId } from "../constants";
import EndStory from "../stories/endStory";
import FortuneTellerStory from "../stories/fortuneTellerStory";
import NameFindingStory from "../stories/nameFindingStory";
import ProfileQuestionStory from "../stories/profileQuestionStory";
import { StateContext } from "../providers/stateProvider";
import ProfileStory from "../stories/profileStory";
import FortuneSelectStory from "../stories/topicSelectStory";
import { UserContext } from "../providers/userProvider";
import LogInOutScreen from "./logInOutScreen";

const Stories: React.FC = () => {
  const {
    sessionStateId,
    setSessionStateId,
    setAnimationStateId,
    setShowChat,
    started,
  } = useContext(StateContext);
  const { detectionId, userId, user } = useContext(UserContext);
  const [showLogInOutScreen, setShowLogInOutScreen] = useState(false);

  useEffect(() => {
    switch (sessionStateId) {
      case SessionStateId.NEW_SESSION:
        setAnimationStateId(AnimationStateId.NEW_SESSION_1);
        setShowChat(true);
        break;
      case SessionStateId.WELCOME_OLD_USER:
        setSessionStateId(SessionStateId.TOPIC_SELECTION);
        break;

      case SessionStateId.FORTUNE_TELLER:
        setAnimationStateId(AnimationStateId.FORTUNE_TELLER);
        setShowChat(true);
        break;

      case SessionStateId.PROFILE_QUESTIONS:
        setAnimationStateId(AnimationStateId.FORTUNE_TELLER);
        setShowChat(true);
        break;

      case SessionStateId.PROFILE:
        setAnimationStateId(AnimationStateId.IDLE);
        setShowChat(false);
        break;

      case SessionStateId.TOPIC_SELECTION:
        setAnimationStateId(AnimationStateId.IDLE);
        setShowChat(false);
        break;

      case SessionStateId.NAME_FINDING:
        setAnimationStateId(AnimationStateId.FORTUNE_TELLER);
        setShowChat(true);
        break;

      case SessionStateId.END_SESSION:
        setAnimationStateId(AnimationStateId.IDLE);
        setShowChat(true);
        break;

      default:
        setAnimationStateId(AnimationStateId.IDLE);
        setShowChat(false);
        break;
    }
  }, [sessionStateId, setSessionStateId, setAnimationStateId, setShowChat]);

  useEffect(() => {
    if (!userId) return;
    if (sessionStateId !== SessionStateId.NO_SESSION) return;

    if (user?.name) setSessionStateId(SessionStateId.WELCOME_OLD_USER);
    else setSessionStateId(SessionStateId.NEW_SESSION);
  }, [userId, user?.name, setSessionStateId, sessionStateId]);

  useEffect(() => {
    if (!started) {
      setShowLogInOutScreen(false);
      return;
    }

    if ((userId === detectionId) === undefined) {
      setShowLogInOutScreen(false);
      return;
    }

    if (userId === detectionId) {
      setShowLogInOutScreen(false);
      return;
    }

    if (!userId || !detectionId || userId !== detectionId) {
      setShowLogInOutScreen(true);
      return;
    }

    setShowLogInOutScreen(false);
  }, [userId, detectionId, started]);

  return (
    <>
      {sessionStateId === SessionStateId.NEW_SESSION && <NewUserStory />}
      {sessionStateId === SessionStateId.NAME_FINDING && <NameFindingStory />}
      {sessionStateId === SessionStateId.PROFILE_QUESTIONS && (
        <ProfileQuestionStory />
      )}
      {sessionStateId === SessionStateId.FORTUNE_TELLER && (
        <FortuneTellerStory />
      )}
      {sessionStateId === SessionStateId.PROFILE && <ProfileStory />}
      {sessionStateId === SessionStateId.TOPIC_SELECTION && (
        <FortuneSelectStory />
      )}
      {sessionStateId === SessionStateId.END_SESSION && <EndStory />}
      {showLogInOutScreen && <LogInOutScreen />}
    </>
  );
};

export default Stories;
