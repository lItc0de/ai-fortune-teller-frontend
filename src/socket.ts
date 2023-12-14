import Session from "./session";
import SpeechSynthesis from "./speechSynthesis";
import User from "./user";
import type InOutHelper from "./utils/inOutHelper";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

class Socket {
  private webSocket: WebSocket;
  private inOutHelper: InOutHelper;
  private connected = false;
  private botUser: User;
  private speechSynthesis: SpeechSynthesis;
  private session?: Session;
  private waitingForBot = false;

  constructor(inOutHelper: InOutHelper) {
    this.webSocket = new WebSocket(BACKEND_URL);
    this.inOutHelper = inOutHelper;
    this.botUser = new User("bot111", "bot");
    this.speechSynthesis = new SpeechSynthesis();

    this.addEventListeners();
    this.inOutHelper.registerInputHandler(this.userMessageHandler);
  }

  // needs to be called everytime there is a new session
  newSession(session: Session) {
    console.log("newSession called:", session.user.id);

    this.session = session;
    this.webSocket.removeEventListener("message", this.messageHandler);
    this.webSocket.addEventListener("message", this.messageHandler);
  }

  userMessageHandler = (msg: string) => {
    if (this.waitingForBot) return;

    this.startWaitingForBot();
    if (this.connected) this.webSocket.send(msg);
    this.session?.messages.add(msg, this.session.user);
    this.writeMessage();
  };

  private addEventListeners() {
    this.webSocket.addEventListener("open", this.openHandler);
    this.webSocket.addEventListener("close", this.closeErrorHandler);
    this.webSocket.addEventListener("error", this.closeErrorHandler);
  }

  private messageHandler = (msg: MessageEvent) => {
    if (!this.waitingForBot) return;

    this.session?.messages.add(msg.data, this.botUser);
    this.speechSynthesis.speak(msg.data);
    this.writeMessage();
    this.stopWaitingForBot();
  };

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

  private writeMessage() {
    const output = this.session?.messages.toString();
    if (output) this.inOutHelper.write(output);
  }

  private startWaitingForBot() {
    this.waitingForBot = true;
    this.inOutHelper.toggleWaitingForBot(this.waitingForBot);
  }

  private stopWaitingForBot() {
    this.waitingForBot = false;
    this.inOutHelper.toggleWaitingForBot(this.waitingForBot);
  }
}

export default Socket;
