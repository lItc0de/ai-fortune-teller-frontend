import BotMessage, { BotMessageType } from "../utils/botMessage";
import useFetch from "./useFetch";

const BACKEND_URL = `http://${import.meta.env.VITE_BACKEND_URL}/chat`;

const useChatBot = () => {
  const fetchData = useFetch();

  const sendMessage = async (prompt: string) => {
    const message = new BotMessage(BotMessageType.PROMPT, prompt);
    const res = await fetchData(BACKEND_URL, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: message.toJSONString(),
    });

    if (!res) return "Something went wrong!";

    return await res.json();
  };

  return { sendMessage };
};

export default useChatBot;
