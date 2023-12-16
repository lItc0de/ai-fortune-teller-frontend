import User from "../utils/user";
import InOutHelper from "../utils/inOutHelper";
import BaseStory from "./baseStory";
import StoryState, { StoryIds } from "../utils/storyState";

class OldUserStory extends BaseStory {
  constructor(user: User, botUser: User, inOutHelper: InOutHelper) {
    super(user, botUser, inOutHelper);
  }

  async *tell() {
    await this.inOutHelper.writeWithSynthesis(
      `Welcome back ${this.user.name}!
      What can I do for you?`,
      this.botUser
    );
    yield new StoryState(StoryIds.WELCOME_OLD_USER, undefined, true);
  }
}

export default OldUserStory;
