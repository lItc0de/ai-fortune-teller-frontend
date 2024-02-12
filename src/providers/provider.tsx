import { ReactNode, useState } from "react";
import { SettingsContext } from "./settingsProvider";
import UsersProvider from "./usersProvider";
import UserProvider from "./userProvider";
import StateProvider from "./stateProvider";
import ChatElementsProvider from "./chatElementsProvider";
import KeyboardProvider from "./keyboardProvider";

type Props = {
  detectionIdSubscribe: (onStoreChange: () => void) => () => void;
  getDetectionId: () => string | undefined;
  children: ReactNode;
};

const Provider: React.FC<Props> = ({
  children,
  detectionIdSubscribe,
  getDetectionId,
}) => {
  const [ttsEnabled] = useState(true);

  return (
    <SettingsContext.Provider value={{ ttsEnabled }}>
      <UsersProvider>
        <UserProvider
          detectionIdSubscribe={detectionIdSubscribe}
          getDetectionId={getDetectionId}
        >
          <StateProvider>
            <ChatElementsProvider>
              <KeyboardProvider>{children}</KeyboardProvider>
            </ChatElementsProvider>
          </StateProvider>
        </UserProvider>
      </UsersProvider>
    </SettingsContext.Provider>
  );
};

export default Provider;
