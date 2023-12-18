import Socket from "./socket";
import User, { UserType } from "./utils/user";
import Users from "./utils/users";
import FortuneTellerNewSessionDrawer from "./drawers/fortuneTellerNewSessionDrawer";
import InOutHelper from "./utils/inOutHelper";
import GlassBallDrawer from "./drawers/glassBallDrawer";
import StoryState, { StoryIds } from "./utils/storyState";
// import StoryTeller from "./utils/storyTeller";
// import { pause } from "./utils/helpers";
import SocketMessage, { SocketMessageType } from "./utils/socketMessage";
import EventLoop from "./messageQueue/eventLoop";
import EndSessionStory from "./stories/endSessionStory";
import NameFinderStory from "./stories/nameFinderStory";
import FortuneTellerStory from "./stories/fortuneTellerStory";
import NewOldSessionDrawer from "./drawers/newOldSessionDrawer";

import fortuneTellerImg from "./media/fortuneTelling.png";

class State {
  private eventLoop: EventLoop;
  private socket: Socket;
  private inOutHelper: InOutHelper;

  private botUser: User;
  private users: Users;
  private currentUser?: User;
  // private currentStoryTeller?: StoryTeller;

  private newSessionDrawer: FortuneTellerNewSessionDrawer;
  private newOldSessionDrawer: NewOldSessionDrawer;
  private glassBallDrawer: GlassBallDrawer;

  private fortuneTellerImg: HTMLImageElement;

  currentState: StoryIds = StoryIds.NO_SESSION;
  storyState: StoryState;

  storyId = 0;

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

    this.storyState = new StoryState(StoryIds.NO_SESSION);

    this.eventLoop.onStoryStateChange = this.changeStoryStateCallback;

    // only for testing
    // this.newSession("defaultUser");
    // this.newSession("undefined");

    this.fortuneTellerImg.src = fortuneTellerImg;
  }

  private changeStoryStateCallback = (storyState: StoryState) => {
    console.log(storyState);

    this.storyState = storyState;
    if (!this.currentUser) return;

    switch (storyState.nextStoryId) {
      case StoryIds.NAME_FINDING:
        const nameFinderStory = new NameFinderStory(
          this.currentUser,
          this.botUser,
          this.inOutHelper
        );
        this.eventLoop.enqueue(nameFinderStory.getAFTEvent());
        break;

      case StoryIds.FORTUNE_TELLER:
        const fortuneTellerStory = new FortuneTellerStory(
          this.currentUser,
          this.botUser,
          this.inOutHelper,
          this.socket
        );
        this.eventLoop.enqueue(fortuneTellerStory.getAFTEvent());
        break;
    }

    switch (storyState.storyId) {
      case StoryIds.NAME_FINDING:
        this.showFortuneTellerImg();

        if (storyState.isEnd && storyState.returnValue) {
          this.currentUser.name = storyState.returnValue;
          this.socket.send(
            new SocketMessage(
              SocketMessageType.USERNAME,
              undefined,
              this.currentUser.name
            )
          );
        }
        break;

      case StoryIds.FORTUNE_TELLER:
        this.showFortuneTellerImg();
        break;

      case StoryIds.NO_SESSION:
        this.hideFortuneTellerImg();
        break;

      case StoryIds.NEW_SESSION:
        this.hideFortuneTellerImg();
        this.socket.send(new SocketMessage(SocketMessageType.NEW_SESSION));
        break;

      case StoryIds.END_SESSION:
        this.hideFortuneTellerImg();
        break;

      case StoryIds.INTRO1:
        this.hideFortuneTellerImg();
        break;

      case StoryIds.INTRO2:
        this.hideFortuneTellerImg();
        break;

      case StoryIds.WELCOME_OLD_USER:
        this.hideFortuneTellerImg();
        this.socket.send(
          new SocketMessage(
            SocketMessageType.OLD_SESSION,
            undefined,
            this.currentUser.name
          )
        );
        break;
    }
  };

  newSession = async (userId: string) => {
    console.log("New session called");

    await this.eventLoop.clear();
    this.storyState = new StoryState(StoryIds.NO_SESSION);

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

    // // OLD------------------>

    // await this.abortOldSession();

    // // no User, no Session
    // if (userId === "undefined" && this.currentStoryTeller === undefined) return;

    // // no User, old Session
    // if (userId === "undefined" && this.currentStoryTeller !== undefined) {
    //   await this.currentStoryTeller.end();
    //   this.currentStoryTeller = undefined;
    //   return;
    // }

    // // new User, old Session
    // if (userId !== "undefined" && this.currentStoryTeller !== undefined) {
    //   this.currentStoryTeller = undefined;
    // }

    // // new User, no Session
    // this.currentUser = this.users.find(userId) || this.users.create(userId);
    // this.storyState = new StoryState(StoryIds.NEW_SESSION);

    // this.currentStoryTeller = new StoryTeller(
    //   this.inOutHelper,
    //   this.socket,
    //   this.botUser,
    //   this.currentUser,
    //   this.changeStateCallback,
    //   this.storyId
    // );

    // this.storyId++;

    // // Previous user
    // if (this.currentUser.name) {
    //   this.socket.send(
    //     new SocketMessage(
    //       SocketMessageType.OLD_SESSION,
    //       undefined,
    //       this.currentUser.name
    //     )
    //   );
    // } else {
    //   this.socket.send(new SocketMessage(SocketMessageType.NEW_SESSION));
    //   await this.newSessionDrawer.draw(this.glassBallDrawer);
    // }

    // await this.currentStoryTeller.tell();
  };

  // private async abortOldSession() {
  //   this.storyState = new StoryState(StoryIds.NO_SESSION);
  //   this.newSessionDrawer.abort();
  //   this.currentStoryTeller?.abort();
  //   await pause(3000);
  // }

  private showFortuneTellerImg() {
    this.fortuneTellerImg.style.display = "block";
  }

  private hideFortuneTellerImg() {
    this.fortuneTellerImg.style.display = "none";
  }
}

export default State;
