import { ReactNode, createContext, useCallback, useState } from "react";
import User from "../utils/user";

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
};

const UsersProvider: React.FC<Props> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);

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