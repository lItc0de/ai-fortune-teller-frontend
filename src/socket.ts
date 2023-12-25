import SocketMessage, { SocketMessageType } from "./utils/socketMessage";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

class Socket {
  private webSocket: WebSocket;
  private connected = false;
  private aborted = false;

  constructor() {
    this.webSocket = new WebSocket(BACKEND_URL);
    this.addEventListeners();
  }

  abort = () => {
    this.aborted = true;
  };

  send = (message: SocketMessage): Promise<SocketMessage> =>
    new Promise((resolve) => {
      if (!this.connected) {
        console.error("Socket not connected");
        return resolve(
          new SocketMessage(SocketMessageType.PROMPT, "Not connected")
        );
      }
      this.aborted = false;

      const handleResponse = (response: MessageEvent) => {
        this.webSocket.removeEventListener("message", handleResponse);
        const responseMessage = SocketMessage.createfromJSON(response.data);

        if (this.aborted)
          return resolve(new SocketMessage(SocketMessageType.ABORT));

        return resolve(responseMessage);
      };

      this.webSocket.addEventListener("message", handleResponse);
      this.webSocket.send(message.toJSON());
    });

  private addEventListeners() {
    this.webSocket.addEventListener("open", this.openHandler);
    this.webSocket.addEventListener("close", this.closeErrorHandler);
    this.webSocket.addEventListener("error", this.closeErrorHandler);
  }

  private openHandler = () => {
    this.connected = true;
    console.log("new connection");
  };

  private closeErrorHandler = (event?: Event) => {
    this.connected = false;

    if (event?.type === "error") {
      console.error("Error connecting Websocket");
      return;
    }

    console.log("disconnected");
  };
}

export default Socket;
