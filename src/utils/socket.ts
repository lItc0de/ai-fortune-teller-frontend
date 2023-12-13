// import { Manager } from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default () => {
  const socket = new WebSocket(BACKEND_URL);

  // message is received
  socket.addEventListener("message", (event) => {
    console.log("message:", event.data);
  });

  // socket opened
  socket.addEventListener("open", () => {
    console.log("new connection");
  });

  // socket closed
  socket.addEventListener("close", () => {});

  // error handler
  socket.addEventListener("error", (event) => {
    console.error(event);
  });

  // const manager = new Manager(BACKEND_URL, {
  //   reconnectionDelayMax: 10000,
  // });

  // const socket = manager.socket("/admin", {});

  // socket.on("connect", () => {
  //   console.log(socket.id);
  // });

  return socket;
};
