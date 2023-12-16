import User from "../utils/user";
import InOutHelper from "../utils/inOutHelper";
import BaseStory from "./baseStory";
import StoryState, { StoryIds } from "../utils/storyState";

class EndSessionStory extends BaseStory {
  constructor(user: User, botUser: User, inOutHelper: InOutHelper) {
    super(user, botUser, inOutHelper);
  }

  async *tell() {
    yield new StoryState(StoryIds.END_SESSION);

    if (this.user.name) {
      await this.inOutHelper.writeWithSynthesis(
        `Goodbye ${this.user.name}!
        Was nice talking to you.`,
        this.botUser
      );
    } else {
      await this.inOutHelper.writeWithSynthesis(
        `Goodbye Human!
        Was nice talking to you.`,
        this.botUser
      );
    }

    yield new StoryState(StoryIds.END_SESSION, undefined, true);
  }
}

export default EndSessionStory;
