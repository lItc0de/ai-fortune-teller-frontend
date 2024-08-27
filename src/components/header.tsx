import { useContext, useEffect, useState } from "react";
import styles from "./header.module.css";
import { UserContext } from "../providers/userProvider";
import useFaceVideo from "../hooks/useFaceVideo";
import { KeyboardContext } from "../providers/keyboardProvider";
import { StateContext } from "../providers/stateProvider";
import { SessionStateId } from "../constants";

const SIZE = 60;

const Header: React.FC = () => {
  const { user } = useContext(UserContext);
  const { canvasRef } = useFaceVideo(SIZE);
  const { keyPressed } = useContext(KeyboardContext);
  const { setSessionStateId, sessionStateId } = useContext(StateContext);
  const [showProfileBtn, setShowProfileBtn] = useState(false);
  const [showHomeBtn, setShowHomeBtn] = useState(false);

  useEffect(() => {
    if (showProfileBtn && keyPressed("p")) {
      setSessionStateId(SessionStateId.PROFILE);
      return;
    }
    if (showHomeBtn && keyPressed(["Meta", "Backspace"])) {
      setSessionStateId(SessionStateId.TOPIC_SELECTION);
      return;
    }
  }, [keyPressed, showProfileBtn, setSessionStateId, showHomeBtn]);

  useEffect(() => {
    if (!user?.name) return setShowProfileBtn(false);
    if (sessionStateId === SessionStateId.PROFILE) {
      setShowProfileBtn(false);
      setShowHomeBtn(true);
      return;
    }

    if (sessionStateId === SessionStateId.TOPIC_SELECTION) {
      setShowProfileBtn(true);
      setShowHomeBtn(false);
      return;
    }

    if (sessionStateId === SessionStateId.NAME_FINDING) {
      setShowProfileBtn(false);
      setShowHomeBtn(false);
      return;
    }

    if (sessionStateId === SessionStateId.PROFILE_QUESTIONS) {
      setShowProfileBtn(false);
      setShowHomeBtn(false);
      return;
    }

    setShowProfileBtn(true);
    setShowHomeBtn(true);
  }, [user?.name, sessionStateId]);

  if (!user) return <></>;

  return (
    <header className={styles.header}>
      <canvas ref={canvasRef}></canvas>
      <span className={styles.userName}>{user.name}</span>{" "}
      <div className={styles.actions}>
        {showProfileBtn && (
          <span className={styles.profileHint}>
            Press <span className="key-hint">[p]</span> for Profile
          </span>
        )}
        {showHomeBtn && (
          <span className={styles.homeBtn}>
            Press <span className="key-hint">[command] + [backspace]</span> for
            Home
          </span>
        )}
      </div>
    </header>
  );
};

export default Header;
