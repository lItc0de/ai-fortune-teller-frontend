import { useCallback, useContext } from "react";
import ServerMessage, { Role } from "../utils/serverMessage";
import useFetch from "./useFetch";
import { UserContext } from "../providers/userProvider";
import { StateContext } from "../providers/stateProvider";

const BACKEND_URL = `http://${import.meta.env.VITE_BACKEND_URL}/chat`;

const useChatBot = () => {
  const { userId } = useContext(UserContext);
  const { topic } = useContext(StateContext);
  const fetchData = useFetch();

  const sendUserMessage = useCallback(
    async (content: string): Promise<ServerMessage> => {
      if (topic === undefined || !userId) throw new Error("Wrong context");

      const message = new ServerMessage({
        userId,
        role: Role.user,
        content,
        topic,
      });

      const res = await fetchData(BACKEND_URL, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: message.toJSONString(),
      });

      if (!res) throw new Error("No Server response");
      const data = await res.json();

      return new ServerMessage(data);
    },
    [topic, userId, fetchData]
  );

  return { sendUserMessage };
};

export default useChatBot;
