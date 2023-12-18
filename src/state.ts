import Socket from "./socket";
import User, { UserType } from "./utils/user";
import Users from "./utils/users";
import FortuneTellerNewSessionDrawer from "./drawers/fortuneTellerNewSessionDrawer";
import InOutHelper from "./utils/inOutHelper";
import GlassBallDrawer from "./drawers/glassBallDrawer";
import StoryState, { StoryIds } from "./utils/storyState";
import StoryTeller from "./utils/storyTeller";
import { pause } from "./utils/helpers";
import SocketMessage, { SocketMessageType } from "./utils/socketMessage";

class State {
  private socket: Socket;
  private inOutHelper: InOutHelper;

  private botUser: User;
  private users: Users;
  private currentUser?: User;
  private currentStoryTeller?: StoryTeller;

  private newSessionDrawer: FortuneTellerNewSessionDrawer;
  private glassBallDrawer: GlassBallDrawer;

  currentState: StoryIds = StoryIds.NO_SESSION;
  storyState: StoryState;

  storyId = 0;

  constructor(GlassBallDrawer: GlassBallDrawer) {
    this.socket = new Socket();
    this.inOutHelper = new InOutHelper();

    this.botUser = new User("bot111", UserType.BOT);
    this.users = new Users();

    this.newSessionDrawer = new FortuneTellerNewSessionDrawer(
      this.inOutHelper,
      this.botUser,
      this.changeStateCallback
    );
    this.glassBallDrawer = GlassBallDrawer;

    this.storyState = new StoryState(StoryIds.NO_SESSION);

    // only for testing
    // this.newSession("defaultUser");
    // this.newSession("undefined");
  }

  newSession = async (userId: string) => {
    await this.abortOldSession();

    // no User, no Session
    if (userId === "undefined" && this.currentStoryTeller === undefined) return;

    // no User, old Session
    if (userId === "undefined" && this.currentStoryTeller !== undefined) {
      await this.currentStoryTeller.end();
      this.currentStoryTeller = undefined;
      return;
    }

    // new User, old Session
    if (userId !== "undefined" && this.currentStoryTeller !== undefined) {
      this.currentStoryTeller = undefined;
    }

    // new User, no Session
    this.currentUser = this.users.find(userId) || this.users.create(userId);
    this.storyState = new StoryState(StoryIds.NEW_SESSION);

    this.currentStoryTeller = new StoryTeller(
      this.inOutHelper,
      this.socket,
      this.botUser,
      this.currentUser,
      this.changeStateCallback,
      this.storyId
    );

    this.storyId++;

    // Previous user
    if (this.currentUser.name) {
      this.socket.send(
        new SocketMessage(
          SocketMessageType.OLD_SESSION,
          undefined,
          this.currentUser.name
        )
      );
    } else {
      this.socket.send(new SocketMessage(SocketMessageType.NEW_SESSION));
      await this.newSessionDrawer.draw(this.glassBallDrawer);
    }

    await this.currentStoryTeller.tell();
  };

  private changeStateCallback = (storyState: StoryState) => {
    this.storyState = storyState;
    if (storyState.storyId === StoryIds.NAME_FINDING && storyState.isEnd) {
      if (storyState.returnValue)
        this.socket.send(
          new SocketMessage(SocketMessageType.USERNAME, storyState.returnValue)
        );
    }
  };

  private async abortOldSession() {
    this.storyState = new StoryState(StoryIds.NO_SESSION);
    this.newSessionDrawer.abort();
    this.currentStoryTeller?.abort();
    await pause(3000);
  }
}

export default State;
