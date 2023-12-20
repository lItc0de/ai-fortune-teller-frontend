import Socket from "./socket";
import User, { UserType } from "./utils/user";
import Users from "./utils/users";
import FortuneTellerNewSessionDrawer from "./drawers/fortuneTellerNewSessionDrawer";
import InOutHelper from "./utils/inOutHelper";
import GlassBallDrawer from "./drawers/glassBallDrawer";
import StateReturn from "./utils/stateReturn";
import SocketMessage, { SocketMessageType } from "./utils/socketMessage";
import EventLoop from "./messageQueue/eventLoop";
import EndSessionStory from "./stories/endSessionStory";
import NameFinderStory from "./stories/nameFinderStory";
import FortuneTellerStory from "./stories/fortuneTellerStory";
import NewOldSessionDrawer from "./drawers/newOldSessionDrawer";

import fortuneTellerImg from "./media/fortuneTelling.png";

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

  private newSessionDrawer: FortuneTellerNewSessionDrawer;
  private newOldSessionDrawer: NewOldSessionDrawer;
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

    this.newSessionDrawer = new FortuneTellerNewSessionDrawer(
      this.inOutHelper,
      this.botUser,
      this.glassBallDrawer,
      this.changeStoryStateCallback
    );

    this.newOldSessionDrawer = new NewOldSessionDrawer(
      this.inOutHelper,
      this.botUser,
      this.glassBallDrawer,
      this.currentUser
    );

    this.eventLoop.onStoryStateChange = this.changeStoryStateCallback;

    // only for testing
    // this.newSession("defaultUser");
    // this.newSession("undefined");

    this.fortuneTellerImg.src = fortuneTellerImg;
  }

  private changeStoryStateCallback = (stateReturn: StateReturn) => {
    console.log(stateReturn);

    this.stateId = stateReturn.stateId;
    if (!this.currentUser) return;

    switch (stateReturn.nextStoryId) {
      case StateId.NAME_FINDING:
        const nameFinderStory = new NameFinderStory(
          this.currentUser,
          this.botUser,
          this.inOutHelper
        );
        this.eventLoop.enqueue(nameFinderStory.getAFTEvent());
        break;

      case StateId.FORTUNE_TELLER:
        const fortuneTellerStory = new FortuneTellerStory(
          this.currentUser,
          this.botUser,
          this.inOutHelper,
          this.socket
        );
        this.eventLoop.enqueue(fortuneTellerStory.getAFTEvent());
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
      const endSessionStory = new EndSessionStory(
        this.currentUser,
        this.botUser,
        this.inOutHelper
      );
      this.eventLoop.enqueue(endSessionStory.getAFTEvent());
      return;
    }

    this.currentUser = this.users.find(userId) || this.users.create(userId);

    if (this.currentUser.name) {
      this.newOldSessionDrawer.user = this.currentUser;
      this.eventLoop.enqueue(this.newOldSessionDrawer.getAFTEvent());
      return;
    }

    this.eventLoop.enqueue(this.newSessionDrawer.getAFTEvent());
  };

  private showFortuneTellerImg() {
    this.fortuneTellerImg.style.display = "block";
  }

  private hideFortuneTellerImg() {
    this.fortuneTellerImg.style.display = "none";
  }
}

export default State;
