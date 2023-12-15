import User from "../user";
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
    await this.inOutHelper.writeWithSynthesis(
      `Goodbyes ${this.user.name}!
      Was nice talking to you.`,
      this.botUser
    );
  }
}

export default EndSessionStory;
