import User from "../utils/user";
import InOutHelper from "../utils/inOutHelper";
import BaseEvent from "./baseEvent";
import StateReturn from "../utils/stateReturn";
import { pause } from "../utils/helpers";
import { StateId } from "../state";

class EndSessionEvent extends BaseEvent {
  constructor(user: User, botUser: User, inOutHelper: InOutHelper) {
    super(botUser, inOutHelper, user);
  }

  async abort() {
    await this.inOutHelper.abort();
  }

  async *eventIterator() {
    yield new StateReturn(StateId.END_SESSION);

    if (this.user?.name) {
      await this.inOutHelper.writeWithSynthesis(
        `Goodbye ${this.user.name}!
        Was nice talking to you.`,
        this.botUser
      );
    } else {
      await this.inOutHelper.writeWithSynthesis(
        `Goodbye Human!
        Was nice talking to you.`,
        this.botUser
      );
    }

    await pause(2000);
    this.inOutHelper.clearOutputArea();

    yield new StateReturn(StateId.END_SESSION, undefined, true);
  }
}

export default EndSessionEvent;
