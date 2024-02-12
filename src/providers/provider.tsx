import { ReactNode, useState } from "react";
import { SettingsContext } from "./settingsProvider";
import UsersProvider from "./usersProvider";
import UserProvider from "./userProvider";
import StateProvider from "./stateProvider";
import ChatElementsProvider from "./chatElementsProvider";
import KeyboardProvider from "./keyboardProvider";
import User from "../utils/user";
import { DBUser } from "../store";

type Props = {
  detectionIdSubscribe: (onStoreChange: () => void) => () => void;
  getDetectionId: () => string | undefined;
  initialUsers: User[];
  children: ReactNode;
  updateUserInStore: (
    dbUser: Partial<DBUser> & { id: string }
  ) => Promise<void>;
};

const Provider: React.FC<Props> = ({
  children,
  detectionIdSubscribe,
  getDetectionId,
  initialUsers,
  updateUserInStore,
}) => {
  const [ttsEnabled] = useState(false);

  return (
    <SettingsContext.Provider value={{ ttsEnabled }}>
      <UsersProvider initialUsers={initialUsers}>
        <UserProvider
          detectionIdSubscribe={detectionIdSubscribe}
          getDetectionId={getDetectionId}
          updateUserInStore={updateUserInStore}
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
