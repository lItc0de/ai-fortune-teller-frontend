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
      console.log(e.key);

      if (!e.key) return;
      setKey(e.key);

      if (e.key === "#") setTtsEnabled((ttsEnabled) => !ttsEnabled);
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
  }, [capture, setSessionStateId, setTtsEnabled]);

  return (
    <KeyboardContext.Provider value={{ key, setCapture }}>
      {children}
    </KeyboardContext.Provider>
  );
};

export default KeyboardProvider;
