import { useContext, useEffect, useState } from "react";
import styles from "./header.module.css";
import { UserContext } from "../providers/userProvider";
import useFaceVideo from "../hooks/useFaceVideo";
import { KeyboardProviderContext } from "../providers/keyboardProvider";
import { StateContext } from "../providers/stateProvider";
import { SessionStateId } from "../constants";

const SIZE = 60;

const Header: React.FC = () => {
  const { user } = useContext(UserContext);
  const { canvasRef } = useFaceVideo(SIZE);
  const { key } = useContext(KeyboardProviderContext);
  const { setSessionStateId, sessionStateId } = useContext(StateContext);
  const [showProfileBtn, setShowProfileBtn] = useState(false);

  useEffect(() => {
    if (!showProfileBtn) return;
    if (key === "p") {
      setSessionStateId(SessionStateId.PROFILE);
    }
  }, [key, showProfileBtn, setSessionStateId]);

  useEffect(() => {
    if (!user?.name) return setShowProfileBtn(false);
    if (sessionStateId === SessionStateId.PROFILE)
      return setShowProfileBtn(false);

    if (sessionStateId === SessionStateId.NAME_FINDING)
      return setShowProfileBtn(false);

    if (sessionStateId === SessionStateId.PROFILE_QUESTIONS)
      return setShowProfileBtn(false);

    setShowProfileBtn(true);
  }, [user?.name, sessionStateId]);

  if (!user) return <></>;

  return (
    <header className={styles.header}>
      <canvas ref={canvasRef}></canvas>
      <span className={styles.userName}>{user.name}</span>{" "}
      {showProfileBtn && (
        <span className={styles.profileHint}>
          Press <span className="key-hint">[p]</span> for Profile
        </span>
      )}
    </header>
  );
};

export default Header;
