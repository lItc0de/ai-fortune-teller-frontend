import { useContext } from "react";
import styles from "./header.module.css";
import { UserContext } from "../providers/userProvider";

const Header: React.FC = () => {
  const { user } = useContext(UserContext);

  return (
    <header className={styles.header}>
      {user && (
        <>
          <span className="user-name">{user.name}</span>{" "}
          <span className="user-id">{user.id}</span>
        </>
      )}
    </header>
  );
};

export default Header;
