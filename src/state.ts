import Socket from "./socket";
import User from "./utils/user";
import NameFinderStory from "./stories/nameFinderStory";
import FortuneTellerStory from "./stories/fortuneTellerStory";
import Users from "./utils/users";
import OldUserStory from "./stories/oldUserStory";
import EndSessionStory from "./stories/endSessionStory";
import FortuneTellerNewSessionDrawer from "./drawers/fortuneTellerNewSessionDrawer";
import InOutHelper from "./utils/inOutHelper";
import GlassBallDrawer from "./drawers/glassBallDrawer";
// import Transcribe from "./transcribe";

export enum States {
  NO_SESSION,
  NEW_SESSION,
  WELCOME_OLD_USER,
  NAME_FINDING,
  FORTUNE_TELLER,
}

class State {
  private socket: Socket;
  // private transcribe: Transcribe;
  private botUser: User;
  private users: Users;
  private currentUser?: User;

  private newSessionDrawer: FortuneTellerNewSessionDrawer;
  private glassBallDrawer: GlassBallDrawer;

  currentState: States = States.NO_SESSION;

  constructor(GlassBallDrawer: GlassBallDrawer) {
    this.botUser = new User("bot111", "bot");
    this.socket = new Socket();
    // this.transcribe = new Transcribe();
    this.users = new Users();
    this.newSessionDrawer = new FortuneTellerNewSessionDrawer();
    this.glassBallDrawer = GlassBallDrawer;

    // only for testing
    // this.newSession("defaultUser");
  }

  newSession = async (userId: string) => {
    if (userId === "undefined") {
      this.currentState = States.NO_SESSION;
      this.newSessionDrawer.hideVideo();

      if (this.currentUser) {
        const endSessionStory = new EndSessionStory(
          this.currentUser,
          this.botUser
        );
        await endSessionStory.sayGoodbye();
      }
    }

    this.currentUser?.endSession();
    this.currentUser = undefined;
    InOutHelper.hideElements();

    if (userId === "undefined") return;

    this.currentState = States.NEW_SESSION;

    await this.newSessionDrawer.drawNewSessionAnimation(this.glassBallDrawer);

    let user = this.users.find(userId);

    if (user && user.name) {
      this.currentUser = user;
      this.currentUser.newSession();
      this.welcomeOldUser();
      return;
    }

    this.currentUser = this.users.create(userId);
    this.currentUser.newSession();

    this.startNameFinding();
  };

  async welcomeOldUser() {
    if (!(this.currentState === States.NEW_SESSION)) return;
    if (!this.currentUser) return;

    this.currentState = States.WELCOME_OLD_USER;

    const oldUserStory = new OldUserStory(this.currentUser, this.botUser);
    await oldUserStory.greetOldUser();

    this.startFortuneTeller();
  }

  async startNameFinding() {
    if (!(this.currentState === States.NEW_SESSION)) return;
    if (!this.currentUser) return;

    this.currentState = States.NAME_FINDING;

    const nameFinderStory = new NameFinderStory(this.botUser);
    const name = await nameFinderStory.findName();

    this.currentUser.name = name;

    console.log("name");

    console.log("Username:", this.currentUser.name);

    this.startFortuneTeller();
  }

  startFortuneTeller() {
    if (
      !(this.currentState === States.NAME_FINDING) &&
      !(this.currentState === States.WELCOME_OLD_USER)
    ) {
      return;
    }
    if (!this.currentUser) return;

    this.currentState = States.FORTUNE_TELLER;

    const fortuneTellerStory = new FortuneTellerStory(
      this.currentUser,
      this.socket,
      this.botUser
    );
    fortuneTellerStory.start();
  }
}

export default State;
