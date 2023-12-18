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
  private _nextStoryId?: StoryIds;

  constructor(
    storyId: StoryIds,
    returnValue?: string,
    isEnd?: boolean,
    nextStoryId?: StoryIds
  ) {
    this._storyId = storyId;
    this._returnValue = returnValue;
    if (isEnd !== undefined) this._isEnd = isEnd;
    this._nextStoryId = nextStoryId;
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

  get nextStoryId() {
    return this._nextStoryId;
  }
}

export default StoryState;
