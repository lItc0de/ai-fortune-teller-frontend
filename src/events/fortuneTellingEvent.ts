import Socket from "../socket";
import User from "../user";
import InOutHelper from "../utils/inOutHelper";
import BaseEvent from "./baseEvent";
import StateReturn from "../utils/stateReturn";
import SocketMessage, { SocketMessageType } from "../utils/socketMessage";
import { StateId } from "../state";

class FortuneTellingEvent extends BaseEvent {
  private socket: Socket;

  constructor(
    user: User,
    botUser: User,
    inOutHelper: InOutHelper,
    socket: Socket
  ) {
    super(botUser, inOutHelper, user);
    this.socket = socket;
  }

  async abort() {
    this.inOutHelper.abort();
    this.socket.abort();
  }

  async *eventIterator() {
    yield new StateReturn(StateId.FORTUNE_TELLER);

    await this.inOutHelper.writeWithSynthesis(
      "I'm ready to to look into my glassball to tell you everything you wish to know. So go ahead!",
      this.botUser
    );

    yield new StateReturn(StateId.FORTUNE_TELLER);

    while (true) {
      const question = await this.inOutHelper.waitForUserInput();
      this.inOutHelper.write(question, this.user);

      yield new StateReturn(StateId.FORTUNE_TELLER);

      if (question !== "") {
        const response = await this.socket.send(
          new SocketMessage(SocketMessageType.PROMPT, question, this.user?.name)
        );
        if (response.type === SocketMessageType.BOT && response.prompt) {
          await this.inOutHelper.writeWithSynthesis(
            response.prompt,
            this.botUser
          );
        } else {
          console.log(response);
        }
      }

      yield new StateReturn(StateId.FORTUNE_TELLER);
    }
  }
}

export default FortuneTellingEvent;
