import { ReactNode } from "react";
import SettingsProvider from "./settingsProvider";
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
  return (
    <SettingsProvider>
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
    </SettingsProvider>
  );
};

export default Provider;
