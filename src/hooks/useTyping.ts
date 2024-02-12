import { useCallback, useState } from "react";
import { sleep } from "../utils/helpers";

const useTyping = (
  text: string
): [startTyping: () => Promise<void>, text: string, done: boolean] => {
  const [innerText, setInnerText] = useState("");
  const [done, setDone] = useState(false);

  const startTyping = useCallback(async () => {
    const textParts = text.split(" ");
    for (let i = 0; i < textParts.length; i++) {
      const part = textParts[i];
      setInnerText((prevText) => [prevText, part].join(" "));
      await sleep(100);
    }
    setDone(true);
  }, [text]);

  return [startTyping, innerText, done];
};

export default useTyping;
