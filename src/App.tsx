import { useCallback, useContext, useEffect, useState } from "react";
import Header from "./components/header";
import Canvas from "./components/canvas";
import styles from "./app.module.css";
import Player from "./components/player";
import Stories from "./components/stories";
import Chat from "./components/chat/chat";
import { StateContext } from "./providers/stateProvider";
import { KeyboardProviderContext } from "./providers/keyboardProvider";

type Props = {
  handleStartCallback: () => void;
};

const App: React.FC<Props> = ({ handleStartCallback }) => {
  const [showStartBtn, setShowStartBtn] = useState(true);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const { showChat } = useContext(StateContext);
  const { key } = useContext(KeyboardProviderContext);

  const handleStartClick = useCallback(() => {
    setShowStartBtn(false);
    setShouldAnimate(true);
    handleStartCallback();
  }, [handleStartCallback]);

  useEffect(() => {
    if (!showStartBtn) return;
    if (key !== "s") return;
    handleStartClick();
  }, [key, handleStartClick, showStartBtn]);

  return (
    <>
      <Header />
      <Player />
      <Canvas shouldAnimate={shouldAnimate} />
      {showStartBtn && (
        <input
          type="button"
          id="startBtn"
          value="Start"
          className={styles.startBtn}
          onClick={handleStartClick}
        />
      )}
      {showChat && <Chat />}
      <Stories />
    </>
  );
};

export default App;
