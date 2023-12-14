import Session from "./session";
import Socket from "./socket";
import InOutHelper from "./utils/inOutHelper";

class State {
  session: Session | undefined;

  private inOutHelper: InOutHelper;
  private socket: Socket;

  constructor(inOutHelper: InOutHelper) {
    this.inOutHelper = inOutHelper;
    this.socket = new Socket(this.inOutHelper);

    this.newSession("defaultUser");
  }

  newSession = (userId: string) => {
    // tbd handle no user
    if (userId === "undefined") return;

    this.session = new Session(userId);
    this.socket.newSession(this.session);
  };
}

export default State;
