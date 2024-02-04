// import EventLoop from "./utils/eventLoop";

// import StateReturn from "./utils/stateReturn";
// import NewUserSessionEvent from "./events/newUserSessionEvent";
// import NewKnownUserSessionEvent from "./events/newKnownUserSessionEvent";
// import NameFindingEvent from "./events/nameFindingEvent";
// import FortuneTellingEvent from "./events/fortuneTellingEvent";
// import EndSessionEvent from "./events/endSessionEvent";
// import Socket from "./socket";
import User from "./user";
import { SessionStateId } from "./constants";

class Session {
  // private eventLoop: EventLoop;
  // private socket: Socket;
  // private SessionStateId: SessionStateId = SessionStateId.NO_SESSION;
  private user: User;
  private setStateId: React.Dispatch<React.SetStateAction<SessionStateId>>;

  constructor(
    user: User,
    setStateId: React.Dispatch<React.SetStateAction<SessionStateId>>
  ) {
    this.user = user;
    this.setStateId = setStateId;

    if (this.user.name) this.newStoryState(SessionStateId.WELCOME_OLD_USER);
    else this.newStoryState(SessionStateId.NEW_SESSION);
  }

  end() {
    this.newStoryState(SessionStateId.END_SESSION);
  }

  newStoryState(sessionStateId: SessionStateId) {
    this.setStateId(sessionStateId);
    // switch (SessionStateId) {
    //   case SessionStateId.NO_SESSION:
    //     this.eventLoop.clear();
    //     break;
    //   case SessionStateId.NEW_SESSION:
    //     this.eventLoop.enqueue(
    //       new NewUserSessionEvent(
    //         this.inOutHelper,
    //         this.glassBallDrawer,
    //         this.socket
    //       )
    //     );
    //     break;
    //   case SessionStateId.INTRO1:
    //     break;
    //   case SessionStateId.INTRO2:
    //     break;
    //   case SessionStateId.WELCOME_OLD_USER1:
    //     this.eventLoop.enqueue(
    //       new NewKnownUserSessionEvent(
    //         this.inOutHelper,
    //         this.glassBallDrawer,
    //         this.socket,
    //         this.users.currentUser
    //       )
    //     );
    //     break;
    //   case SessionStateId.WELCOME_OLD_USER2:
    //     break;
    //   case SessionStateId.NAME_FINDING:
    //     if (!this.users.currentUser) break;
    //     this.eventLoop.enqueue(
    //       new NameFindingEvent(
    //         this.inOutHelper,
    //         this.socket,
    //         this.users.currentUser
    //       )
    //     );
    //     break;
    //   case SessionStateId.FORTUNE_TELLER:
    //     this.eventLoop.enqueue(
    //       new FortuneTellingEvent(
    //         this.inOutHelper,
    //         this.socket,
    //         this.users.currentUser
    //       )
    //     );
    //     break;
    //   case SessionStateId.END_SESSION:
    //     this.eventLoop.enqueue(
    //       new EndSessionEvent(
    //         this.inOutHelper,
    //         this.socket,
    //         this.users.currentUser
    //       )
    //     );
    //     break;
    // }
  }

  // private changeStoryStateCallback = (stateReturn: StateReturn) => {
  //   this.SessionStateId = stateReturn.SessionStateId;
  //   if (stateReturn.isEnd && stateReturn.nextStoryId) {
  //     this.newStoryState(stateReturn.nextStoryId);
  //   }
  // };
}

export default Session;
