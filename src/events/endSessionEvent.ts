import User from "../user";
import InOutHelper from "../utils/inOutHelper";
import BaseEvent from "./baseEvent";
import StateReturn from "../utils/stateReturn";
import { sleep } from "../utils/helpers";
import Socket from "../socket";
import SocketMessage, { SocketMessageType } from "../utils/socketMessage";
import { StateId } from "../constants";

class EndSessionEvent extends BaseEvent {
  socket: Socket;

  constructor(inOutHelper: InOutHelper, socket: Socket, user?: User) {
    super(inOutHelper, user);
    this.socket = socket;
  }

  async abort() {
    await this.inOutHelper.abort();
  }

  async *eventIterator() {
    yield new StateReturn(StateId.END_SESSION);

    this.socket.send(new SocketMessage(SocketMessageType.END_SESSION));

    if (this.user?.name) {
      await this.inOutHelper.writeWithSynthesis(
        `Goodbye ${this.user.name}!
        Was nice talking to you.`
      );
    } else {
      await this.inOutHelper.writeWithSynthesis(
        `Goodbye Human!
        Was nice talking to you.`
      );
    }

    await sleep(2000);
    this.inOutHelper.clearOutputArea();

    yield new StateReturn(
      StateId.END_SESSION,
      undefined,
      true,
      StateId.NO_SESSION
    );
  }
}

export default EndSessionEvent;
