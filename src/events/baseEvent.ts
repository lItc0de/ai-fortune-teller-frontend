import User from "../utils/user";
import InOutHelper from "../utils/inOutHelper";
import StateReturn from "../utils/stateReturn";

abstract class BaseEvent {
  protected inOutHelper: InOutHelper;
  protected botUser: User;
  protected user?: User;

  constructor(botUser: User, inOutHelper: InOutHelper, user?: User) {
    this.botUser = botUser;
    this.inOutHelper = inOutHelper;
    this.user = user;

    this.eventIterator.bind(this);
    this.abort.bind(this);
  }

  abstract eventIterator(): AsyncGenerator<StateReturn, void, unknown>;
  abstract abort(): Promise<void>;
}

export default BaseEvent;
