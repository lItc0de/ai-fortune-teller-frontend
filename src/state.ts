import Socket from "./socket";
import Users from "./users";
import InOutHelper from "./utils/inOutHelper";
import StateReturn from "./utils/stateReturn";
import EventLoop from "./utils/eventLoop";

import fortuneTellerImg from "./media/fortuneTelling.webp";
import NewUserSessionEvent from "./events/newUserSessionEvent";
import NewKnownUserSessionEvent from "./events/newKnownUserSessionEvent";
import GlassBallDrawer from "./utils/glassBallDrawer";
import NameFindingEvent from "./events/nameFindingEvent";
import FortuneTellingEvent from "./events/fortuneTellingEvent";
import EndSessionEvent from "./events/endSessionEvent";
import Store from "./store";

export enum StateId {
  NO_SESSION,
  INTRO1,
  INTRO2,
  NEW_SESSION,
  WELCOME_OLD_USER1,
  WELCOME_OLD_USER2,
  NAME_FINDING,
  FORTUNE_TELLER,
  END_SESSION,
}

class State {
  private eventLoop: EventLoop;
  private socket: Socket;
  private inOutHelper: InOutHelper;
  private store: Store;

  private glassBallDrawer: GlassBallDrawer;
  private fortuneTellerImg: HTMLImageElement;

  users: Users;
  stateId: StateId = StateId.NO_SESSION;

  constructor(eventLoop: EventLoop, glassBallDrawer: GlassBallDrawer) {
    this.eventLoop = eventLoop;
    this.socket = new Socket();
    this.inOutHelper = new InOutHelper();

    this.store = new Store();
    this.users = new Users(this.store);
    this.glassBallDrawer = glassBallDrawer;

    this.fortuneTellerImg = document.getElementById(
      "fortuneTellerImg"
    ) as HTMLImageElement;

    this.eventLoop.onStoryStateChange = this.changeStoryStateCallback;
    this.fortuneTellerImg.src = fortuneTellerImg;

    this.users.onLogin = this.handleLogin;
    this.users.onLogout = this.handleLogout;
  }

  async init() {
    await this.store.init();
    await this.users.init();
  }

  private handleLogin = () => {
    if (
      this.stateId !== StateId.NO_SESSION &&
      this.stateId !== StateId.END_SESSION
    ) {
      console.error("Login called with existing session");
      return;
    }

    if (!this.users.currentUser) {
      console.error("Login called without user");
      return;
    }

    if (this.users.currentUser.name) {
      this.newStoryState(StateId.WELCOME_OLD_USER1);
      return;
    }

    this.newStoryState(StateId.NEW_SESSION);
  };

  private handleLogout = () => {
    this.eventLoop.clear();

    this.newStoryState(StateId.END_SESSION);
  };

  private newStoryState(stateId: StateId) {
    switch (stateId) {
      case StateId.NO_SESSION:
        this.eventLoop.clear();
        break;

      case StateId.NEW_SESSION:
        this.eventLoop.enqueue(
          new NewUserSessionEvent(
            this.inOutHelper,
            this.glassBallDrawer,
            this.socket
          )
        );
        break;

      case StateId.INTRO1:
        break;

      case StateId.INTRO2:
        break;

      case StateId.WELCOME_OLD_USER1:
        this.eventLoop.enqueue(
          new NewKnownUserSessionEvent(
            this.inOutHelper,
            this.glassBallDrawer,
            this.socket,
            this.currentUser
          )
        );
        break;

      case StateId.WELCOME_OLD_USER2:
        break;

      case StateId.NAME_FINDING:
        if (!this.currentUser) break;

        this.eventLoop.enqueue(
          new NameFindingEvent(this.inOutHelper, this.socket, this.currentUser)
        );
        break;

      case StateId.FORTUNE_TELLER:
        this.eventLoop.enqueue(
          new FortuneTellingEvent(
            this.inOutHelper,
            this.socket,
            this.currentUser
          )
        );
        break;

      case StateId.END_SESSION:
        this.eventLoop.enqueue(
          new EndSessionEvent(this.inOutHelper, this.socket, this.currentUser)
        );
        break;
    }
  }

  private changeStoryStateCallback = (stateReturn: StateReturn) => {
    this.stateId = stateReturn.stateId;
    if (stateReturn.isEnd && stateReturn.nextStoryId) {
      this.newStoryState(stateReturn.nextStoryId);
    }
  };

  // private showFortuneTellerImg() {
  //   this.fortuneTellerImg.style.display = "block";
  // }

  // private hideFortuneTellerImg() {
  //   this.fortuneTellerImg.style.display = "none";
  // }

  private get currentUser() {
    return this.users.currentUser;
  }
}

export default State;
