const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

class Socket {
  private webSocket: WebSocket;
  private connected = false;

  constructor() {
    this.webSocket = new WebSocket(BACKEND_URL);
    this.addEventListeners();
  }

  send = (msg: string): Promise<string> =>
    new Promise((resolve, reject) => {
      if (!this.connected) return reject("Not connected");

      const handleResponse = (response: MessageEvent) => {
        this.webSocket.removeEventListener("message", handleResponse);
        return resolve(response.data);
      };

      this.webSocket.addEventListener("message", handleResponse);
      this.webSocket.send(msg);
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
