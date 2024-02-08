import { useEffect, useRef } from "react";
import { GeneratorState } from "../types";

const useEventIterator = () => {
  const abortController = useRef<AbortController>();

  const iterate = (eventIterator: AsyncGenerator<GeneratorState>) =>
    new Promise<string | undefined>((resolve, reject) => {
      if (!abortController.current) return reject("no AbortController");
      const currentAbortController = abortController.current;

      const handleAbort = () => {
        currentAbortController.signal.removeEventListener("abort", handleAbort);
        eventIterator.return("Abort");
        return reject(new Error("Aborted"));
      };

      currentAbortController.signal.addEventListener("abort", handleAbort);

      const handleDone = (value?: string) => {
        currentAbortController.signal.removeEventListener("abort", handleAbort);
        return resolve(value);
      };

      next(eventIterator, handleDone);
    });

  const next = async (
    eventIterator: AsyncGenerator<GeneratorState>,
    handleDone: (value?: string) => void
  ) => {
    const res = await eventIterator.next();
    if (!res) return;

    const generatorState: GeneratorState = res.value;
    if (generatorState && generatorState.done) {
      handleDone(generatorState.value);
      return;
    }

    if (res.done) {
      handleDone("Unexpected done");
      return;
    }

    next(eventIterator, handleDone);
  };

  useEffect(() => {
    abortController.current = new AbortController();
    const currentAbortController = abortController.current;
    return () => {
      currentAbortController.abort();
    };
  }, []);

  return iterate;
};

export default useEventIterator;
