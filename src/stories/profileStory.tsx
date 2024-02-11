import { useContext, useEffect } from "react";
import useFaceVideo from "../hooks/useFaceVideo";
import styles from "./profileStory.module.css";
import { UserContext } from "../providers/userProvider";
import { KeyboardProviderContext } from "../providers/keyboardProvider";
import { StateContext } from "../providers/stateProvider";
import { SessionStateId } from "../constants";

const ProfileStory: React.FC = () => {
  const { user } = useContext(UserContext);
  const { key } = useContext(KeyboardProviderContext);
  const { setSessionStateId } = useContext(StateContext);
  const { canvasRef } = useFaceVideo(150);

  const handleClick = () => setSessionStateId(SessionStateId.TOPIC_SELECTION);

  useEffect(() => {
    if (key !== "b") return;
    setSessionStateId(SessionStateId.TOPIC_SELECTION);
  }, [key, setSessionStateId]);

  return (
    <section className={styles.profile}>
      <div className={styles.userImage}>
        <canvas ref={canvasRef}></canvas>
      </div>
      <div className={styles.profileRight}>
        <div className={styles.userInfo}>
          <p>Name: {user?.name || "User"}</p>
          {user && (
            <ul>
              {user.profileQuestionsSelection.map((question) => (
                <li>{question}</li>
              ))}
            </ul>
          )}
        </div>
        <button onClick={handleClick}>[b] Back</button>
      </div>
    </section>
  );
};

export default ProfileStory;
