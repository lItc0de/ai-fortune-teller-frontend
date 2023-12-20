import User from "../utils/user";
import InOutHelper from "../utils/inOutHelper";
import StateReturn from "../utils/stateReturn";
import { StateId } from "../state";

class BaseStory {
  protected inOutHelper: InOutHelper;
  protected user: User;
  protected botUser: User;
  protected active = true;

  constructor(user: User, botUser: User, inOutHelper: InOutHelper) {
    this.inOutHelper = inOutHelper;
    this.user = user;
    this.botUser = botUser;
  }

  async *tell(): AsyncGenerator<StateReturn, void, unknown> {
    yield new StateReturn(StateId.NO_SESSION);
  }
}

export default BaseStory;
