import User from "../utils/user";
import InOutHelper from "../utils/inOutHelper";
import StoryState, { StoryIds } from "../utils/storyState";

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

  async *tell(): AsyncGenerator<StoryState, void, unknown> {
    yield new StoryState(StoryIds.NO_SESSION);
  }
}

export default BaseStory;
