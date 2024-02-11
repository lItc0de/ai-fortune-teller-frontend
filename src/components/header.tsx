import { useContext } from "react";
import styles from "./header.module.css";
import { UserContext } from "../providers/userProvider";
import useFaceVideo from "../hooks/useFaceVideo";

const SIZE = 60;

const Header: React.FC = () => {
  const { user } = useContext(UserContext);
  const { canvasRef } = useFaceVideo(SIZE);

  if (!user) return <></>;

  return (
    <header className={styles.header}>
      <canvas ref={canvasRef}></canvas>
      <span className={styles.userName}>{user.name}</span>{" "}
      {/* <span className={styles.userId}>{user.id}</span> */}
      <span className={styles.profileHint}>Press [p] for Profile</span>
    </header>
  );
};

export default Header;
