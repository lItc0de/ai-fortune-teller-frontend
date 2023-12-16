export enum StoryIds {
  NO_SESSION,
  INTRO1,
  INTRO2,
  NEW_SESSION,
  WELCOME_OLD_USER,
  NAME_FINDING,
  FORTUNE_TELLER,
  END_SESSION,
}

class StoryState {
  private _storyId: StoryIds;
  private _returnValue?: string;
  private _isEnd = false;

  constructor(storyId: StoryIds, returnValue?: string, isEnd?: boolean) {
    this._storyId = storyId;
    this._returnValue = returnValue;
    if (isEnd !== undefined) this._isEnd = isEnd;
  }

  get storyId() {
    return this._storyId;
  }

  get returnValue(): string | undefined {
    return this._returnValue;
  }

  get isEnd() {
    return this._isEnd;
  }
}

export default StoryState;
