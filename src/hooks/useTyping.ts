import { useCallback, useState } from "react";
import { sleep } from "../utils/helpers";
import useTTS from "./useTTS";
import TTSDisabledError from "../errors/ttsDisabledError";
import TTSNetworkError from "../errors/ttsNetworkError";

const useTyping = (text: string) => {
  const [textPart, setTextPart] = useState("Typing...");
  const [typingDone, setTypingDone] = useState(false);
  const { playSound, transcribe } = useTTS();

  const type = useCallback(async () => {
    const textParts = text.split(" ");
    setTextPart("");
    for (let i = 0; i < textParts.length; i++) {
      const part = textParts[i];
      setTextPart((prevText) => [prevText, part].join(" "));
      await sleep(100);
    }
  }, [text]);

  const startTyping = useCallback(async () => {
    await type();
    setTypingDone(true);
  }, [type]);

  const startTypingWithTTS = useCallback(async () => {
    try {
      await transcribe(text);
      await Promise.all([type(), playSound()]);
    } catch (error) {
      if (
        error instanceof TTSDisabledError ||
        error instanceof TTSNetworkError
      ) {
        await type();
      }
    }
    setTypingDone(true);
  }, [type, text]); // eslint-disable-line react-hooks/exhaustive-deps

  return { startTyping, startTypingWithTTS, textPart, typingDone };
};

export default useTyping;
