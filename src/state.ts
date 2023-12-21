import Socket from "./socket";
import User, { UserType } from "./user";
import Users from "./users";
import InOutHelper from "./utils/inOutHelper";
import StateReturn from "./utils/stateReturn";
import SocketMessage, { SocketMessageType } from "./utils/socketMessage";
import EventLoop from "./utils/eventLoop";

import fortuneTellerImg from "./media/fortuneTelling.webp";
import NewUserSessionEvent from "./events/newUserSessionEvent";
import NewKnownUserSessionEvent from "./events/newKnownUserSessionEvent";
import GlassBallDrawer from "./utils/glassBallDrawer";
import NameFindingEvent from "./events/nameFindingEvent";
import FortuneTellingEvent from "./events/fortuneTellingEvent";
import EndSessionEvent from "./events/endSessionEvent";

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

  private botUser: User;
  private users: Users;
  private currentUser?: User;

  private glassBallDrawer: GlassBallDrawer;
  private fortuneTellerImg: HTMLImageElement;

  stateId: StateId = StateId.NO_SESSION;

  constructor(eventLoop: EventLoop, glassBallDrawer: GlassBallDrawer) {
    this.eventLoop = eventLoop;
    this.socket = new Socket();
    this.inOutHelper = new InOutHelper();

    this.botUser = new User("bot111", UserType.BOT);
    this.users = new Users();
    this.glassBallDrawer = glassBallDrawer;

    this.fortuneTellerImg = document.getElementById(
      "fortuneTellerImg"
    ) as HTMLImageElement;

    this.eventLoop.onStoryStateChange = this.changeStoryStateCallback;
    this.fortuneTellerImg.src = fortuneTellerImg;

    // only for testing
    // this.newSession("defaultUser");
    // this.newSession("undefined");
  }

  private changeStoryStateCallback = (stateReturn: StateReturn) => {
    console.log(stateReturn);

    this.stateId = stateReturn.stateId;
    if (!this.currentUser) return;

    switch (stateReturn.nextStoryId) {
      case StateId.NAME_FINDING:
        const nameFinderStory = new NameFindingEvent(
          this.currentUser,
          this.botUser,
          this.inOutHelper
        );
        this.eventLoop.enqueue(nameFinderStory);
        break;

      case StateId.FORTUNE_TELLER:
        const fortuneTellerStory = new FortuneTellingEvent(
          this.currentUser,
          this.botUser,
          this.inOutHelper,
          this.socket
        );
        this.eventLoop.enqueue(fortuneTellerStory);
        break;
    }

    switch (stateReturn.stateId) {
      case StateId.NAME_FINDING:
        this.showFortuneTellerImg();

        if (stateReturn.isEnd && stateReturn.returnValue) {
          this.currentUser.name = stateReturn.returnValue;
          this.socket.send(
            new SocketMessage(
              SocketMessageType.USERNAME,
              undefined,
              this.currentUser.name
            )
          );
        }
        break;

      case StateId.FORTUNE_TELLER:
        this.showFortuneTellerImg();
        break;

      case StateId.NO_SESSION:
        this.hideFortuneTellerImg();
        break;

      case StateId.NEW_SESSION:
        this.hideFortuneTellerImg();
        this.socket.send(new SocketMessage(SocketMessageType.NEW_SESSION));
        break;

      case StateId.END_SESSION:
        this.hideFortuneTellerImg();
        break;

      case StateId.INTRO1:
        this.hideFortuneTellerImg();
        break;

      case StateId.INTRO2:
        this.hideFortuneTellerImg();
        break;

      case StateId.WELCOME_OLD_USER1:
        this.hideFortuneTellerImg();
        this.socket.send(
          new SocketMessage(
            SocketMessageType.OLD_SESSION,
            undefined,
            this.currentUser.name
          )
        );
        break;

      case StateId.WELCOME_OLD_USER2:
        this.hideFortuneTellerImg();
        break;
    }
  };

  newSession = async (userId: string) => {
    console.log("New session called");

    await this.eventLoop.clear();
    this.stateId = StateId.NO_SESSION;

    if (userId === "undefined" && this.currentUser === undefined) return;

    if (userId === "undefined" && this.currentUser !== undefined) {
      const endSessionStory = new EndSessionEvent(
        this.currentUser,
        this.botUser,
        this.inOutHelper
      );
      this.eventLoop.enqueue(endSessionStory);
      return;
    }

    this.currentUser = this.users.find(userId) || this.users.create(userId);

    if (this.currentUser.name) {
      const newKnownUserSessionEvent = new NewKnownUserSessionEvent(
        this.currentUser,
        this.botUser,
        this.inOutHelper,
        this.glassBallDrawer
      );
      this.eventLoop.enqueue(newKnownUserSessionEvent);
      return;
    }

    const newUserSessionEvent = new NewUserSessionEvent(
      this.botUser,
      this.inOutHelper,
      this.glassBallDrawer,
      this.changeStoryStateCallback
    );

    this.eventLoop.enqueue(newUserSessionEvent);
  };

  private showFortuneTellerImg() {
    this.fortuneTellerImg.style.display = "block";
  }

  private hideFortuneTellerImg() {
    this.fortuneTellerImg.style.display = "none";
  }
}

export default State;
