import StateReturn from "../utils/stateReturn";

export interface AFTEventReturnValue {
  value?: any;
  done: boolean;
}

class AFTEvent {
  eventIterator: () => AsyncGenerator<StateReturn, void, unknown>;
  _abort?: () => Promise<void> | void;

  constructor(
    eventIterator: () => AsyncGenerator<StateReturn, void, unknown>,
    abort?: () => Promise<void> | void
  ) {
    this.eventIterator = eventIterator;
    this._abort = abort;
  }

  async abort() {
    console.log("Abort started");
    if (this._abort) await this._abort();
    console.log("Abort finished");
  }
}

export default AFTEvent;
