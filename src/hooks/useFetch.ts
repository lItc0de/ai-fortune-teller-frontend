import { useEffect, useRef } from "react";

const useFetch = () => {
  const abortController = useRef<AbortController>();

  const fetchData = async (
    input: RequestInfo | URL,
    init?: RequestInit | undefined
  ) => {
    if (!abortController.current) return;
    const res = await fetch(input, {
      ...init,
      signal: abortController.current.signal,
    });
    return res;
  };

  useEffect(() => {
    abortController.current = new AbortController();
    const currentAbortController = abortController.current;
    return () => {
      currentAbortController.abort();
    };
  }, []);

  return fetchData;
};

export default useFetch;
