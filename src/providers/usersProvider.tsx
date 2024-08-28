import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import User from "../utils/user";
import useFetch from "../hooks/useFetch";

const BACKEND_URL = `${import.meta.env.VITE_BACKEND_URL}/users`;

export const UsersContext = createContext<{
  users: User[];
  addUser: (newUser: User) => void;
  updateUser: (user: User) => void;
  findUser: (userId: string) => User | undefined;
}>({
  users: [],
  addUser: () => {},
  updateUser: () => {},
  findUser: () => undefined,
});

type Props = {
  children: ReactNode;
  initialUsers: User[];
};

const UsersProvider: React.FC<Props> = ({ children, initialUsers }) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const fetchData = useFetch();

  const addUser = useCallback((newUser: User) => {
    setUsers((oldUsers) => {
      const newUsers = [...oldUsers, newUser];
      return newUsers;
    });
  }, []);

  const updateUser = useCallback(
    (user: User) => {
      const oldUsers = users.filter(({ id }) => id !== user.id);
      setUsers([...oldUsers, user]);
    },
    [users]
  );

  const findUser = useCallback(
    (userId: string): User | undefined => {
      return users.find(({ id }) => id === userId);
    },
    [users]
  );

  useEffect(() => {
    const deleteOldUsersInBackend = async () => {
      await fetchData(BACKEND_URL, {
        method: "DELETE",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(initialUsers.map(({ id }) => id)),
      });
    };

    deleteOldUsersInBackend();
  }, [initialUsers]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <UsersContext.Provider
      value={{
        users,
        addUser,
        updateUser,
        findUser,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export default UsersProvider;
