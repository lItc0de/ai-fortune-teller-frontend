import User from "../user";
import InOutHelper from "../utils/inOutHelper";
import BaseEvent from "./baseEvent";
import StateReturn from "../utils/stateReturn";
import { countWords } from "../utils/helpers";
import { StateId } from "../state";
import Socket from "../socket";
import SocketMessage, { SocketMessageType } from "../utils/socketMessage";

class NameFindingEvent extends BaseEvent {
  socket: Socket;
  user: User;

  constructor(inOutHelper: InOutHelper, socket: Socket, user: User) {
    super(inOutHelper, user);
    this.socket = socket;
    this.user = user; // for typing
  }

  async abort() {
    this.inOutHelper.abort();
  }

  async *eventIterator() {
    yield new StateReturn(StateId.NAME_FINDING);
    await this.inOutHelper.writeWithSynthesis(
      "All I ask of you is to speak your name!"
    );
    yield new StateReturn(StateId.NAME_FINDING);

    let name;
    let findName = true;
    while (findName) {
      let askForName = true;
      while (askForName) {
        name = (await this.inOutHelper.waitForUserInput())
          .trim()
          .replace(".", "");
        await this.inOutHelper.write(name, false, this.user?.name);
        yield new StateReturn(StateId.NAME_FINDING);

        if (countWords(name) !== 1) {
          await this.inOutHelper.writeWithSynthesis(
            "Oh dear, unfortunately your name got lost in the void, repeat it for me please!"
          );
        } else {
          askForName = false;
        }
        yield new StateReturn(StateId.NAME_FINDING);
      }

      await this.inOutHelper.writeWithSynthesis(
        `So your name is ${name}? A short "yes" or "no" is enough.`
      );

      yield new StateReturn(StateId.NAME_FINDING);

      let checkIfName = true;
      while (checkIfName) {
        const answer = (await this.inOutHelper.waitForUserInput())
          .trim()
          .toLowerCase()
          .replace(".", "");
        await this.inOutHelper.write(answer, true, this.user?.name);

        yield new StateReturn(StateId.NAME_FINDING);

        if (answer === "no") {
          await this.inOutHelper.writeWithSynthesis(
            "Ok, well then tell me your name again."
          );
          checkIfName = false;
          yield new StateReturn(StateId.NAME_FINDING);
        } else if (answer === "yes") {
          checkIfName = false;
          findName = false;
          yield new StateReturn(StateId.NAME_FINDING);
        } else {
          await this.inOutHelper.writeWithSynthesis(
            'Please my dear, a short "yes" or "no" is enough.'
          );
          yield new StateReturn(StateId.NAME_FINDING);
        }
      }
    }

    await this.inOutHelper.writeWithSynthesis(
      `Hello my dear ${name}, a beautiful name that is.`
    );

    this.socket.send(
      new SocketMessage(SocketMessageType.USERNAME, undefined, name)
    );

    this.user.name = name;

    yield new StateReturn(
      StateId.NAME_FINDING,
      name,
      true,
      StateId.FORTUNE_TELLER
    );
  }
}

export default NameFindingEvent;
