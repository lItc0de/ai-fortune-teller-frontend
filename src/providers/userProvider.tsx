import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import { UsersContext } from "./usersProvider";
import User from "../utils/user";
import { DBUser } from "../store";
import useFetch from "../hooks/useFetch";

const BACKEND_URL = `http://${import.meta.env.VITE_BACKEND_URL}/user`;

export const UserContext = createContext<{
  user: User | undefined;
  userId: string | undefined;
  detectionId: string | undefined;
  createUser: (id: string) => void;
  findUser: (id: string) => User | undefined;
  login: (newUserId: string) => void;
  logout: () => void;
  updateUsername: (name: string) => void;
  updateProfileQuestionsSelection: (selection: string[]) => void;
}>({
  user: undefined,
  userId: undefined,
  detectionId: undefined,
  createUser: () => {},
  findUser: () => undefined,
  login: () => {},
  logout: () => {},
  updateUsername: () => {},
  updateProfileQuestionsSelection: () => {},
});

type Props = {
  children: ReactNode;
  detectionIdSubscribe: (onStoreChange: () => void) => () => void;
  getDetectionId: () => string | undefined;
  updateUserInStore: (
    dbUser: Partial<DBUser> & { id: string }
  ) => Promise<void>;
};

const UserProvider: React.FC<Props> = ({
  children,
  detectionIdSubscribe,
  getDetectionId,
  updateUserInStore,
}) => {
  const [user, setUser] = useState<User>();
  const [userId, setUserId] = useState<string>();
  const { findUser, addUser, updateUser } = useContext(UsersContext);
  const fetchData = useFetch();

  const createUserInBackend = async (user: User) => {
    await fetchData(BACKEND_URL, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: user.id,
        createdAt: user.createdAt,
        name: user.name,
      }),
    });
  };

  const updateUserInBackend = async (user: User) => {
    await fetchData(BACKEND_URL, {
      method: "PATCH",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: user.id,
        name: user.name,
        characterTraits: user.profileQuestionsSelection,
      }),
    });
  };

  const login = useCallback(
    (newUserId: string) => {
      setUserId(newUserId);
      const newUser = findUser(newUserId);
      if (!newUser) return;
      setUser(newUser);
    },
    [findUser]
  );

  const createUser = useCallback(
    (id: string) => {
      const newUser = new User({ id });
      addUser(newUser);
    },
    [addUser]
  );

  const logout = useCallback(() => {
    setUserId(undefined);
    setUser(undefined);
  }, []);

  const updateUsername = (name: string) => {
    if (!user) return;
    const updatedUser = user.updateName(name);
    updateUser(updatedUser);
    updateUserInStore(updatedUser);
    createUserInBackend(updatedUser);
    setUser(updatedUser);
  };

  const updateProfileQuestionsSelection = (selection: string[]) => {
    if (!user) return;
    const updatedUser = user.updateProfileQuestionsSelection(selection);
    updateUser(updatedUser);
    updateUserInStore(updatedUser);
    updateUserInBackend(updatedUser);
    setUser(updatedUser);
  };

  const detectionId = useSyncExternalStore(
    detectionIdSubscribe,
    getDetectionId
  );

  useEffect(() => {
    if (userId === detectionId) return;
    if (!detectionId) return;

    const foundUser = findUser(detectionId);
    if (foundUser) return;
    createUser(detectionId);
  }, [userId, detectionId, createUser, findUser]);

  return (
    <UserContext.Provider
      value={{
        user,
        userId,
        detectionId,
        createUser,
        findUser,
        login,
        logout,
        updateUsername,
        updateProfileQuestionsSelection,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
