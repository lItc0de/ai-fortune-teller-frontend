import StoryState from "../utils/storyState";

export interface AFTEventReturnValue {
  value?: any;
  done: boolean;
}

class AFTEvent {
  eventIterator: () => AsyncGenerator<StoryState, void, unknown>;
  _abort?: () => Promise<void> | void;

  constructor(
    eventIterator: () => AsyncGenerator<StoryState, void, unknown>,
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
