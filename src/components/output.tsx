import { Message } from "../types";
import styles from "./output.module.css";

type Props = {
  message: Message;
};

const Output: React.FC<Props> = ({ message }) => {
  return (
    <div className={styles.output}>
      <label className={styles.label}>{message.user}</label>
      <output className={styles.text}>{message.text}</output>
    </div>
  );
};

export default Output;
