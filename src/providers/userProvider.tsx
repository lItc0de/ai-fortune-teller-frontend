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
import ServerMessage, { Role, Topic } from "../utils/serverMessage";

const USER_URL = `${import.meta.env.VITE_BACKEND_URL}/user`;
const PROFILE_URL = `${import.meta.env.VITE_BACKEND_URL}/profile`;

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
    await fetchData(USER_URL, {
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
    await fetchData(USER_URL, {
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

  const sendProfileUpdate = useCallback(
    async (selection: string[]) => {
      if (!userId || !user?.name) throw new Error("Wrong context");

      const message = new ServerMessage({
        userId,
        role: Role.user,
        content: `My name is ${
          user.name
        }, and I have the following character traits:
        ${selection.join(", ")}.
        Please give me a short text about my personality.`,
        topic: Topic.GENERAL,
      });

      const res = await fetchData(PROFILE_URL, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: message.toJSONString(),
      });

      if (!res) throw new Error("No Server response");
      const data = await res.json();

      return new ServerMessage(data);
    },
    [userId, fetchData, user?.name]
  );

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

  const updateProfileQuestionsSelection = async (selection: string[]) => {
    if (!user || !user.name) return;
    const response = await sendProfileUpdate(selection);
    const updatedUser = user.updateProfileQuestionsSelection(
      selection,
      response.content
    );
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
