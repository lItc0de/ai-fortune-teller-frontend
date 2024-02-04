import { Message } from "../types";
import Output from "./output";
import styles from "./outputWrapper.module.css";

type Props = {
  messages: Message[];
};

const OutputWrapper: React.FC<Props> = ({ messages }) => {
  return (
    <section className={styles.outputWrapper}>
      {messages.map((message) => (
        <Output message={message} key={message.timestamp} />
      ))}
    </section>
  );
};

export default OutputWrapper;
