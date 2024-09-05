import { useCallback, useContext, useEffect, useRef, useState } from "react";
import styles from "./logInOutScreen.module.css";
import { ChatElementsContext } from "../providers/chatElementsProvider";
import { StateContext } from "../providers/stateProvider";
import { SessionStateId } from "../constants";
import { UserContext } from "../providers/userProvider";
import { KeyboardContext } from "../providers/keyboardProvider";

const LOGOUT_TIMEOUT = 2 * 60 * 1000;
// const LOGOUT_TIMEOUT = 2000;

const LogInOutScreen: React.FC = () => {
  const { clearChatElements } = useContext(ChatElementsContext);
  const { setSessionStateId } = useContext(StateContext);
  const { user, logout, login, userId, detectionId, findUser } =
    useContext(UserContext);
  const { keyPressed } = useContext(KeyboardContext);

  const [showLogin, setShowLogin] = useState(false);
  const [labelText, setLabelText] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout>();

  const btnRef = useRef<HTMLButtonElement>(null);

  const handleClick = useCallback(() => {
    clearChatElements();
    setSessionStateId(SessionStateId.NO_SESSION);

    if (showLogin) {
      if (detectionId) login(detectionId);
    } else logout();
  }, [
    clearChatElements,
    showLogin,
    detectionId,
    login,
    logout,
    setSessionStateId,
  ]);

  useEffect(() => {
    btnRef.current?.focus();

    return () => {
      const inputs = document.getElementsByTagName("input");
      if (inputs.length !== 1) return;
      inputs[0].focus();
    };
  }, []);

  useEffect(() => {
    if (detectionId === userId) return;
    if (!detectionId) {
      setShowLogin(false);
      return;
    }
    setShowLogin(true);
  }, [userId, detectionId]);

  useEffect(() => {
    if (showLogin) {
      if (!detectionId) return;
      const newUser = findUser(detectionId);
      if (newUser?.name) {
        setLabelText(
          `My senses detect a new user! Is that you ${newUser.name}?`
        );
        return;
      }

      setLabelText(`My senses detect a new user!`);
      return;
    }

    if (user?.name) {
      setLabelText(`Goodbye ${user.name}! You really wann a log out?`);
      return;
    }

    setLabelText(`Goodbye! You really wann a log out?`);
  }, [showLogin, user?.name, findUser, detectionId]);

  useEffect(() => {
    if (!keyPressed("Enter")) return;
    handleClick();
  }, [keyPressed, handleClick]);

  // set timeout for logout
  useEffect(() => {
    if (showLogin) return;
    if (!userId) return;
    if (timeoutRef.current) return;

    timeoutRef.current = setTimeout(handleClick, LOGOUT_TIMEOUT);

    return () => {
      if (!timeoutRef.current) return;

      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    };
  }, [showLogin, userId, handleClick]);

  return (
    <div className={styles.logInOutScreen}>
      <div className={styles.dialog}>
        <label className={styles.label}>{labelText}</label>
        <button className={styles.btn} onClick={handleClick} ref={btnRef}>
          <span className="key-hint">[Enter]</span>
          {showLogin ? "Login?" : "Logout?"}
        </button>
      </div>
    </div>
  );
};

export default LogInOutScreen;
