import { useState } from "react";
import Header from "./components/header";
import Canvas from "./components/canvas";
import styles from "./app.module.css";
import Player from "./components/player";
import Stories from "./components/stories";

type Props = {
  handleStartCallback: () => void;
};

const App: React.FC<Props> = ({ handleStartCallback }) => {
  const [showStartBtn, setShowStartBtn] = useState(true);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  const handleStartClick = () => {
    setShowStartBtn(false);
    setShouldAnimate(true);
    handleStartCallback();
  };

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
      <Stories />
    </>
  );
};

export default App;
