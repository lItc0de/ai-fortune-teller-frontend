import User from "../utils/user";
import InOutHelper from "../utils/inOutHelper";

class OldUserStory {
  private inOutHelper: InOutHelper;
  private botUser: User;
  private user: User;

  constructor(user: User, botUser: User) {
    this.inOutHelper = new InOutHelper();
    this.botUser = botUser;
    this.user = user;
  }

  async greetOldUser() {
    await this.inOutHelper.writeWithSynthesis(
      `Welcome back ${this.user.name}!
      What can I do for you?`,
      this.botUser
    );
  }
}

export default OldUserStory;
