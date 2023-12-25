import User from "../user";
import InOutHelper from "../utils/inOutHelper";
import StateReturn from "../utils/stateReturn";

abstract class BaseEvent {
  protected inOutHelper: InOutHelper;
  protected user?: User;

  constructor(inOutHelper: InOutHelper, user?: User) {
    this.inOutHelper = inOutHelper;
    this.user = user;

    this.eventIterator.bind(this);
    this.abort.bind(this);
  }

  abstract eventIterator(): AsyncGenerator<StateReturn, void, unknown>;
  abstract abort(): Promise<void>;
}

export default BaseEvent;
