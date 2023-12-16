import Socket from "./socket";
import User from "./utils/user";
import Users from "./utils/users";
import FortuneTellerNewSessionDrawer from "./drawers/fortuneTellerNewSessionDrawer";
import InOutHelper from "./utils/inOutHelper";
import GlassBallDrawer from "./drawers/glassBallDrawer";
import StoryState, { StoryIds } from "./utils/storyState";
import StoryTeller from "./utils/storyTeller";

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

    this.botUser = new User("bot111", "bot");
    this.users = new Users();

    this.newSessionDrawer = new FortuneTellerNewSessionDrawer();
    this.glassBallDrawer = GlassBallDrawer;

    this.storyState = new StoryState(StoryIds.NO_SESSION);

    // only for testing
    // this.newSession("defaultUser");
    // this.newSession("undefined");
  }

  newSession = async (userId: string) => {
    // no User, no Session
    if (userId === "undefined" && this.currentStoryTeller === undefined) {
      this.resetSession();
      return;
    }

    // no User, old Session
    if (userId === "undefined" && this.currentStoryTeller !== undefined) {
      this.currentStoryTeller.abort();
      await this.currentStoryTeller.goodbye();
      this.currentUser?.endSession();
      this.currentStoryTeller = undefined;
      this.resetSession();
      return;
    }

    // new User, old Session
    if (userId !== "undefined" && this.currentStoryTeller !== undefined) {
      this.currentStoryTeller.abort();
      this.currentUser?.endSession();
      this.currentStoryTeller = undefined;
      this.resetSession();
    }

    // new User, no Session
    this.currentUser = this.users.find(userId) || this.users.create(userId);
    this.storyState = new StoryState(StoryIds.NEW_SESSION);

    this.currentStoryTeller = new StoryTeller(
      this.inOutHelper,
      this.socket,
      this.botUser,
      this.currentUser,
      this.storyChangeStateCallback,
      this.storyId
    );

    this.storyId++;

    await this.newSessionDrawer.drawNewSessionAnimation(this.glassBallDrawer);
    this.inOutHelper.showElements();
    await this.currentStoryTeller.tell();
  };

  private resetSession = () => {
    this.newSessionDrawer.hideVideo();
    this.inOutHelper.hideElements();
    this.storyState = new StoryState(StoryIds.NO_SESSION);
  };

  private storyChangeStateCallback = (storyState: StoryState) => {
    this.storyState = storyState;
    // console.log("Fired", this.storyState.storyId);
  };
}

export default State;
