import { useCallback, useContext, useEffect, useState } from "react";
import Header from "./components/header";
import Canvas from "./components/canvas";
import styles from "./app.module.css";
import Player from "./components/player";
import Stories from "./components/stories";
import Chat from "./components/chat/chat";
import { StateContext } from "./providers/stateProvider";
import { KeyboardContext } from "./providers/keyboardProvider";

type Props = {
  handleStartCallback: () => void;
};

const App: React.FC<Props> = ({ handleStartCallback }) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const { started, setStarted } = useContext(StateContext);
  const { showChat } = useContext(StateContext);
  const { keyPressed } = useContext(KeyboardContext);

  const handleStartClick = useCallback(() => {
    setStarted(true);
    setShouldAnimate(true);
    handleStartCallback();
  }, [handleStartCallback, setStarted]);

  useEffect(() => {
    if (started) return;
    if (!keyPressed("Enter")) return;
    handleStartClick();
  }, [keyPressed, handleStartClick, started]);

  return (
    <>
      <Header />
      <Player />
      <Canvas shouldAnimate={shouldAnimate} />
      {!started && (
        <button
          type="button"
          id="startBtn"
          className={styles.startBtn}
          onClick={handleStartClick}
        >
          <span className="key-hint">[Enter]</span>
          Start
        </button>
      )}
      {showChat && <Chat />}
      <Stories />
    </>
  );
};

export default App;
