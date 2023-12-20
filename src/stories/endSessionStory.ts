import User from "../utils/user";
import InOutHelper from "../utils/inOutHelper";
import BaseStory from "./baseStory";
import StateReturn from "../utils/stateReturn";
import AFTEvent from "../messageQueue/aftEvent";
import { pause } from "../utils/helpers";
import { StateId } from "../state";

class EndSessionStory extends BaseStory {
  constructor(user: User, botUser: User, inOutHelper: InOutHelper) {
    super(user, botUser, inOutHelper);
  }

  getAFTEvent() {
    return new AFTEvent(this.tell.bind(this));
  }

  async *tell() {
    yield new StateReturn(StateId.END_SESSION);

    if (this.user.name) {
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

export default EndSessionStory;
