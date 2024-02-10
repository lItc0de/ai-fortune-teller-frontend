import { ChangeEvent, FormEvent, useRef, useState, useEffect } from "react";
import styles from "../input.module.css";
import ChatInputModel from "./chatInput.model";

const ChatInput: React.FC<ChatInputModel> = ({ handleDone }) => {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    console.log("submit called", value);
    e.preventDefault();
    if (handleDone) handleDone(value);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <input
        onChange={handleChange}
        value={value}
        className={styles.input}
        ref={inputRef}
      />
    </form>
  );
};

export default ChatInput;
