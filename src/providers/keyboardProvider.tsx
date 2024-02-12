import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { StateContext } from "./stateProvider";

export const KeyboardProviderContext = createContext<{
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

  return (
    <KeyboardProviderContext.Provider value={{ key, setCapture }}>
      {children}
    </KeyboardProviderContext.Provider>
  );
};

export default KeyboardProvider;
