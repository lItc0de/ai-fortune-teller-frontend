// import EventLoop from "./utils/eventLoop";

// import StateReturn from "./utils/stateReturn";
// import NewUserSessionEvent from "./events/newUserSessionEvent";
// import NewKnownUserSessionEvent from "./events/newKnownUserSessionEvent";
// import NameFindingEvent from "./events/nameFindingEvent";
// import FortuneTellingEvent from "./events/fortuneTellingEvent";
// import EndSessionEvent from "./events/endSessionEvent";
// import Socket from "./socket";
import User from "./user";
import { StateId } from "./constants";

class Session {
  // private eventLoop: EventLoop;
  // private socket: Socket;
  // private stateId: StateId = StateId.NO_SESSION;
  private user: User;
  private setStateId: React.Dispatch<React.SetStateAction<StateId>>;

  constructor(
    user: User,
    setStateId: React.Dispatch<React.SetStateAction<StateId>>
  ) {
    this.user = user;
    this.setStateId = setStateId;

    if (this.user.name) this.newStoryState(StateId.WELCOME_OLD_USER);
    else this.newStoryState(StateId.NEW_SESSION_1);
  }

  end() {
    this.newStoryState(StateId.END_SESSION);
  }

  newStoryState(stateId: StateId) {
    this.setStateId(stateId);
    // switch (stateId) {
    //   case StateId.NO_SESSION:
    //     this.eventLoop.clear();
    //     break;
    //   case StateId.NEW_SESSION:
    //     this.eventLoop.enqueue(
    //       new NewUserSessionEvent(
    //         this.inOutHelper,
    //         this.glassBallDrawer,
    //         this.socket
    //       )
    //     );
    //     break;
    //   case StateId.INTRO1:
    //     break;
    //   case StateId.INTRO2:
    //     break;
    //   case StateId.WELCOME_OLD_USER1:
    //     this.eventLoop.enqueue(
    //       new NewKnownUserSessionEvent(
    //         this.inOutHelper,
    //         this.glassBallDrawer,
    //         this.socket,
    //         this.users.currentUser
    //       )
    //     );
    //     break;
    //   case StateId.WELCOME_OLD_USER2:
    //     break;
    //   case StateId.NAME_FINDING:
    //     if (!this.users.currentUser) break;
    //     this.eventLoop.enqueue(
    //       new NameFindingEvent(
    //         this.inOutHelper,
    //         this.socket,
    //         this.users.currentUser
    //       )
    //     );
    //     break;
    //   case StateId.FORTUNE_TELLER:
    //     this.eventLoop.enqueue(
    //       new FortuneTellingEvent(
    //         this.inOutHelper,
    //         this.socket,
    //         this.users.currentUser
    //       )
    //     );
    //     break;
    //   case StateId.END_SESSION:
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
  //   this.stateId = stateReturn.stateId;
  //   if (stateReturn.isEnd && stateReturn.nextStoryId) {
  //     this.newStoryState(stateReturn.nextStoryId);
  //   }
  // };
}

export default Session;
