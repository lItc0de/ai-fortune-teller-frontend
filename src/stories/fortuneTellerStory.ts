import Socket from "../socket";
import User from "../utils/user";
import InOutHelper from "../utils/inOutHelper";
import BaseStory from "./baseStory";
import StoryState, { StoryIds } from "../utils/storyState";
import SocketMessage, { SocketMessageType } from "../utils/socketMessage";
import AFTEvent from "../messageQueue/aftEvent";

class FortuneTellerStory extends BaseStory {
  private socket: Socket;

  constructor(
    user: User,
    botUser: User,
    inOutHelper: InOutHelper,
    socket: Socket
  ) {
    super(user, botUser, inOutHelper);
    this.socket = socket;
  }

  abort = () => {
    this.inOutHelper.abort();
    this.socket.abort();
  };

  getAFTEvent() {
    return new AFTEvent(this.tell.bind(this), this.abort);
  }

  async *tell() {
    yield new StoryState(StoryIds.FORTUNE_TELLER);

    await this.inOutHelper.writeWithSynthesis(
      "I'm ready to to look into my glassball to tell you everything you whish to know. So go ahead!",
      this.botUser
    );

    yield new StoryState(StoryIds.FORTUNE_TELLER);

    while (true) {
      const question = await this.inOutHelper.waitForUserInput();
      this.inOutHelper.write(question, this.user);

      yield new StoryState(StoryIds.FORTUNE_TELLER);

      const response = await this.socket.send(
        new SocketMessage(SocketMessageType.PROMPT, question, this.user.name)
      );
      if (response.type === SocketMessageType.BOT && response.prompt) {
        await this.inOutHelper.writeWithSynthesis(
          response.prompt,
          this.botUser
        );
      } else {
        console.log(response);
      }

      yield new StoryState(StoryIds.FORTUNE_TELLER);
    }
  }
}

export default FortuneTellerStory;
