import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { StateContext } from "./stateProvider";
import { SessionStateId } from "../constants";

export const KeyboardProviderContext = createContext<{
  key: string;
  setCapture: (capture: boolean) => void;
}>({
  key: "",
  setCapture: () => {},
});

type Props = {
  children: ReactNode;
};

const KeyboardProvider: React.FC<Props> = ({ children }) => {
  const [key, setKey] = useState("");
  const [capture, setCapture] = useState(true);
  const { setSessionStateId } = useContext(StateContext);

  useEffect(() => {
    if (!capture) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.key) return;
      // e.preventDefault();
      console.log(e.key);

      setKey(e.key);

      if (e.key === "p") {
        setSessionStateId(SessionStateId.PROFILE);
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [capture, setSessionStateId]);

  return (
    <KeyboardProviderContext.Provider value={{ key, setCapture }}>
      {children}
    </KeyboardProviderContext.Provider>
  );
};

export default KeyboardProvider;
