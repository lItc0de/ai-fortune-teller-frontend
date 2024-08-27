import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { StateContext } from "./stateProvider";
import { SettingsContext } from "./settingsProvider";

export const KeyboardContext = createContext<{
  keyPressed: (key: string | string[]) => boolean;
  keys: Map<string, boolean>;
  setCapture: (capture: boolean) => void;
}>({
  keyPressed: () => false,
  keys: new Map<string, boolean>(),
  setCapture: () => {},
});

type Props = {
  children: ReactNode;
};

const KeyboardProvider: React.FC<Props> = ({ children }) => {
  const [keys, setKeys] = useState<Map<string, boolean>>(
    new Map<string, boolean>()
  );
  const [capture, setCapture] = useState(true);
  const { setSessionStateId } = useContext(StateContext);
  const { setTtsEnabled } = useContext(SettingsContext);

  useEffect(() => {
    const innerKeys = new Map<string, boolean>();

    function handleKeyDown(e: KeyboardEvent) {
      if (!e.key) return;
      // console.log(e.key);
      innerKeys.set(e.key, e.type === "keydown");

      setKeys(new Map(innerKeys));
    }

    const handleKeyUp = handleKeyDown;

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      setKeys(new Map<string, boolean>());
    };
  }, [setSessionStateId]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  const keyPressed = useCallback(
    (key: string | string[]): boolean => {
      if (typeof key === "string") {
        if (!capture) return false;
        return !!keys.get(key);
      }

      return key.map((k) => keys.get(k)).every((value) => value);
    },
    [keys, capture]
  );

  useEffect(() => {
    console.log(keys);

    if (keyPressed(["Meta", "#"])) setTtsEnabled((ttsEnabled) => !ttsEnabled);
    if (keyPressed("+")) toggleFullScreen();
  }, [keyPressed, setTtsEnabled, keys]);

  return (
    <KeyboardContext.Provider value={{ keyPressed, setCapture, keys }}>
      {children}
    </KeyboardContext.Provider>
  );
};

export default KeyboardProvider;
