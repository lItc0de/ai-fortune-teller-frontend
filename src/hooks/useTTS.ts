import { useContext, useEffect, useRef } from "react";
import useFetch from "./useFetch";
import { SettingsContext } from "../providers/settingsProvider";
import TTSDisabledError from "../errors/ttsDisabledError";
import TTSNetworkError from "../errors/ttsNetworkError";

const BACKEND_URL = `${import.meta.env.VITE_BACKEND_URL}`;
const ctx = new AudioContext();

const useTTS = () => {
  const fetchData = useFetch();
  const { ttsEnabled } = useContext(SettingsContext);
  const audio = useRef<AudioBuffer | null>(null);
  const player = useRef<AudioBufferSourceNode>();
  const abortController = useRef<AbortController>();

  const fetchAudio = async (text: string) => {
    const res = await fetchData([BACKEND_URL, "tts"].join("/"), {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    return res;
  };

  const playSound = () =>
    new Promise<void>((resolve, reject) => {
      if (!ttsEnabled) return reject(new TTSDisabledError());
      if (!audio) return reject(new Error("no audio"));
      if (!abortController.current) return reject("no AbortController");
      const currentAbortController = abortController.current;

      const handleAbort = () => {
        currentAbortController.signal.removeEventListener("abort", handleAbort);
        return reject(new Error("Aborted"));
      };

      currentAbortController.signal.addEventListener("abort", handleAbort);

      player.current = ctx.createBufferSource();
      const currentPlayer = player.current;
      if (!currentPlayer) return;

      currentPlayer.buffer = audio.current;
      currentPlayer.connect(ctx.destination);

      const handleEnded = () => {
        currentAbortController.signal.removeEventListener("abort", handleAbort);
        currentPlayer.removeEventListener("ended", handleEnded);
        resolve();
      };

      currentPlayer.addEventListener("ended", handleEnded);
      currentPlayer.start(ctx.currentTime);
    });

  const transcribe = async (text?: string) => {
    if (!ttsEnabled) throw new TTSDisabledError();
    if (!text) return;

    let res;
    try {
      res = await fetchAudio(text);
    } catch (error) {
      throw new TTSNetworkError();
    }

    if (!res) return;

    const audioBuffer = await res.arrayBuffer();
    audio.current = await ctx.decodeAudioData(audioBuffer);
  };

  useEffect(() => {
    abortController.current = new AbortController();
    const currentAbortController = abortController.current;
    return () => {
      currentAbortController.abort();
    };
  }, []);

  return { transcribe, playSound };
};

export default useTTS;
