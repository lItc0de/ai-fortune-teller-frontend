import { ReactNode, createContext, useState } from "react";

export const SettingsContext = createContext<{
  ttsEnabled: boolean;
  setTtsEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  ttsEnabled: false,
  setTtsEnabled: () => {},
});

type Props = {
  children: ReactNode;
};

const SettingsProvider: React.FC<Props> = ({ children }) => {
  const [ttsEnabled, setTtsEnabled] = useState(true);

  return (
    <SettingsContext.Provider value={{ ttsEnabled, setTtsEnabled }}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
