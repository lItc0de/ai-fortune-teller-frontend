import Socket from "./socket";
import User from "./user";
import NameFinder from "./NameFinder";
import FortuneTeller from "./FortuneTeller";
import Users from "./users";
import OldUserStory from "./stories/oldUser";
import EndSessionStory from "./stories/endSessionStory";

enum States {
  NO_SESSION,
  NEW_SESSION,
  WELCOME_OLD_USER,
  NAME_FINDING,
  FORTUNE_TELLER,
}

class State {
  private currentState: States = States.NO_SESSION;
  private socket: Socket;
  private botUser: User;
  private users: Users;
  private currentUser?: User;

  constructor() {
    this.botUser = new User("bot111", "bot");
    this.socket = new Socket();
    this.users = new Users();

    // only for testing
    this.newSession("defaultUser");
  }

  newSession = async (userId: string) => {
    if (userId === "undefined") {
      if (this.currentUser) {
        const endSessionStory = new EndSessionStory(
          this.currentUser,
          this.botUser
        );
        await endSessionStory.sayGoodbye();
      }
    }

    this.currentState = States.NO_SESSION;
    this.currentUser?.endSession();
    this.currentUser = undefined;

    if (userId === "undefined") return;

    this.currentState = States.NEW_SESSION;

    let user = this.users.find(userId);

    if (user) {
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

    const nameFinder = new NameFinder(this.botUser);
    const name = await nameFinder.findName();

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

    const fortuneTeller = new FortuneTeller(
      this.currentUser,
      this.socket,
      this.botUser
    );
    fortuneTeller.start();
  }
}

export default State;
