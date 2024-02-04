import { StateId } from "../constants";

class StateReturn {
  private _storyId: StateId;
  private _returnValue?: string;
  private _isEnd = false;
  private _nextStoryId?: StateId;

  constructor(
    stateId: StateId,
    returnValue?: string,
    isEnd?: boolean,
    nextStoryId?: StateId
  ) {
    this._storyId = stateId;
    this._returnValue = returnValue;
    if (isEnd !== undefined) this._isEnd = isEnd;
    this._nextStoryId = nextStoryId;
  }

  get stateId() {
    return this._storyId;
  }

  get returnValue(): string | undefined {
    return this._returnValue;
  }

  get isEnd() {
    return this._isEnd;
  }

  get nextStoryId() {
    return this._nextStoryId;
  }
}

export default StateReturn;
