// import { Manager } from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

class Socket {
  webSocket: WebSocket;

  constructor() {
    this.webSocket = new WebSocket(BACKEND_URL);
    this.addEventListeners();
  }

  addEventListeners() {
    // message is received
    this.webSocket.addEventListener("message", (event) => {
      console.log("message:", event.data);
    });

    // socket opened
    this.webSocket.addEventListener("open", () => {
      console.log("new connection");
    });

    // socket closed
    this.webSocket.addEventListener("close", () => {});

    // error handler
    this.webSocket.addEventListener("error", (event) => {
      console.error(event);
    });
  }
}

export default Socket;
