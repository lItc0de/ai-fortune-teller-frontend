import { useContext, useEffect, useState } from "react";
import useFaceVideo from "../hooks/useFaceVideo";
import styles from "./profileStory.module.css";
import { UserContext } from "../providers/userProvider";
import { KeyboardProviderContext } from "../providers/keyboardProvider";
import { StateContext } from "../providers/stateProvider";
import { SessionStateId } from "../constants";
import { ChatElementsContext } from "../providers/chatElementsProvider";

const ProfileStory: React.FC = () => {
  const { user } = useContext(UserContext);
  const { key } = useContext(KeyboardProviderContext);
  const { clearChatElements } = useContext(ChatElementsContext);
  const { setSessionStateId } = useContext(StateContext);
  const { canvasRef } = useFaceVideo(150);
  const [showProfileQuestionBtn, setShowProfileQuestionBtn] = useState(true);

  const handleBackClick = () =>
    setSessionStateId(SessionStateId.TOPIC_SELECTION);
  const handleProfileQuestionClick = () =>
    setSessionStateId(SessionStateId.PROFILE_QUESTIONS);

  useEffect(() => {
    if (key === "b") setSessionStateId(SessionStateId.TOPIC_SELECTION);
    if (key === "q" && showProfileQuestionBtn)
      setSessionStateId(SessionStateId.PROFILE_QUESTIONS);
  }, [key, setSessionStateId, showProfileQuestionBtn]);

  useEffect(() => {
    clearChatElements();
  }, [clearChatElements]);

  useEffect(() => {
    if (user?.profileQuestionsSelection.length === 0)
      setShowProfileQuestionBtn(true);
    else setShowProfileQuestionBtn(false);
  }, [user?.profileQuestionsSelection]);

  return (
    <section className={styles.profile}>
      <div className={styles.userImage}>
        <canvas ref={canvasRef}></canvas>
      </div>
      <div className={styles.userInfo}>
        <p>Name: {user?.name || "User"}</p>
        {user && (
          <ul>
            {user.profileQuestionsSelection.map((question) => (
              <li key={`key-${question}`}>{question}</li>
            ))}
          </ul>
        )}
      </div>
      <div className={styles.actionBtns}>
        {showProfileQuestionBtn && (
          <button onClick={handleProfileQuestionClick}>
            <span className="key-hint">[q]</span> Fill Profile
          </button>
        )}
        <button onClick={handleBackClick}>
          <span className="key-hint">[b]</span> Back
        </button>
      </div>
    </section>
  );
};

export default ProfileStory;
