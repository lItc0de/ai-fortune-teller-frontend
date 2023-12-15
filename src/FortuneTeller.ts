import Socket from "./socket";
import User from "./user";
import InOutHelper from "./utils/inOutHelper";

class FortuneTeller {
  private inOutHelper: InOutHelper;
  private user: User;
  private botUser: User;
  private socket: Socket;
  private active = true;

  constructor(user: User, socket: Socket, botUser: User) {
    this.inOutHelper = new InOutHelper();
    this.user = user;
    this.socket = socket;
    this.botUser = botUser;
  }

  async start() {
    await this.inOutHelper.writeWithSynthesis(
      "Please ask me anything you like.",
      this.botUser
    );

    await this.fortuneTelling();
  }

  async fortuneTelling() {
    if (!this.active) return;

    const question = await this.inOutHelper.waitForUserInput();
    this.inOutHelper.write(question, this.user);
    const answer = await this.socket.send(question);
    this.inOutHelper.writeWithSynthesis(answer, this.botUser);

    await this.fortuneTelling();
  }
}

export default FortuneTeller;
