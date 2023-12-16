import User from "../utils/user";
import InOutHelper from "../utils/inOutHelper";

class EndSessionStory {
  private inOutHelper: InOutHelper;
  private botUser: User;
  private user: User;

  constructor(user: User, botUser: User) {
    this.inOutHelper = new InOutHelper();
    this.botUser = botUser;
    this.user = user;
  }

  async sayGoodbye() {
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
  }
}

export default EndSessionStory;
