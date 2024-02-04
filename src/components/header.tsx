import { useContext } from "react";
import { UserContext } from "../stateProvider";
import styles from "./header.module.css";

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
