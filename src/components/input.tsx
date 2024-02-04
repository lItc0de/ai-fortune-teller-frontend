import {
  ChangeEvent,
  FormEvent,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import styles from "./input.module.css";

export type RefProps = {
  waitForInput: () => Promise<string>;
};

const Input = forwardRef<RefProps>((_, ref) => {
  const [value, setValue] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [inputCallbackFn, setInputCallbackFn] =
    useState<(res: string) => void>();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    console.log("submit called", value);
    e.preventDefault();
    setDisabled(true);
    if (inputCallbackFn) inputCallbackFn(value);
    setValue("");
  };

  const waitForInput = () =>
    new Promise<string>((resolve) => {
      setDisabled(false);
      setInputCallbackFn(() => (res: string) => resolve(res));
      console.log("waitForInput");
    });

  useImperativeHandle(ref, () => ({
    waitForInput,
  }));

  useEffect(() => {
    if (disabled) return;
    console.log("focus called");

    inputRef.current?.focus();
  }, [disabled]);

  return (
    <form onSubmit={handleSubmit}>
      <input
        onChange={handleChange}
        value={value}
        className={styles.input}
        disabled={disabled}
        ref={inputRef}
      />
    </form>
  );
});

export default Input;
