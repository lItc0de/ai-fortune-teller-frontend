import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { StateContext } from "./stateProvider";
import { SettingsContext } from "./settingsProvider";

export const KeyboardContext = createContext<{
  key?: string;
  setCapture: (capture: boolean) => void;
}>({
  key: undefined,
  setCapture: () => {},
});

type Props = {
  children: ReactNode;
};

const KeyboardProvider: React.FC<Props> = ({ children }) => {
  const [key, setKey] = useState<string>();
  const [capture, setCapture] = useState(true);
  const { setSessionStateId } = useContext(StateContext);
  const { setTtsEnabled } = useContext(SettingsContext);

  useEffect(() => {
    if (!capture) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.key) return;
      setKey(e.key);
    };

    const handleKeyUp = () => {
      setKey(undefined);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      setKey(undefined);
    };
  }, [capture, setSessionStateId]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    if (key === "#") setTtsEnabled((ttsEnabled) => !ttsEnabled);
    if (key === "+") toggleFullScreen();
  }, [key, setTtsEnabled]);

  return (
    <KeyboardContext.Provider value={{ key, setCapture }}>
      {children}
    </KeyboardContext.Provider>
  );
};

export default KeyboardProvider;
