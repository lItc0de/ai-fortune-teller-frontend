import State from "./state";
import User from "./user";
import InOutHelper from "./utils/inOutHelper";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

class Socket {
  private webSocket: WebSocket;
  private state: State;
  private inOutHelper: InOutHelper;
  private connected = false;
  private botUser: User;

  constructor(state: State) {
    this.webSocket = new WebSocket(BACKEND_URL);
    this.state = state;
    this.inOutHelper = new InOutHelper();
    this.botUser = new User("bot111", "bot");

    this.addEventListeners();
    this.inOutHelper.registerInputHandler(this.userMessageHandler);
  }

  // needs to be called everytime there is a new session
  init() {
    this.webSocket.removeEventListener("message", this.messageHandler);
    this.webSocket.addEventListener("message", this.messageHandler);
  }

  userMessageHandler = (msg: string) => {
    if (this.connected) this.webSocket.send(msg);
    this.state.session?.messages.add(msg, this.state.session.user);
    this.writeMessage();
  };

  private addEventListeners() {
    this.webSocket.addEventListener("open", this.openHandler);
    this.webSocket.addEventListener("close", this.closeErrorHandler);
    this.webSocket.addEventListener("error", this.closeErrorHandler);
  }

  private messageHandler = (msg: MessageEvent) => {
    this.state.session?.messages.add(msg.data, this.botUser);
    this.writeMessage();
  };

  private openHandler = () => {
    this.connected = true;
    console.log("new connection");
  };

  private closeErrorHandler = (event?: Event) => {
    this.connected = false;
    console.log("disconnected");

    if (event?.type === "error") console.error(event);
  };

  private writeMessage() {
    const output = this.state.session?.messages.toString();
    if (output) this.inOutHelper.write(output);
  }
}

export default Socket;
