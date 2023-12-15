import Session from "./session";
import Socket from "./socket";
// import InOutHelper from "./utils/inOutHelper";
// import SpeechSynthesis from "./speechSynthesis";
// import Transcribe from "./transcribe";
import User from "./user";
import NameFinder from "./NameFinder";
import FortuneTeller from "./FortuneTeller";

enum States {
  NO_SESSION,
  NEW_SESSION,
  NAME_FINDING,
  FORTUNE_TELLER,
}

class State {
  private currentState: States = States.NO_SESSION;
  private socket: Socket;
  private botUser: User;
  // private inOutHelper: InOutHelper;
  // private _started = false;
  // private cheethaEnabled = false;
  // private speechSynthesis: SpeechSynthesis;
  // private currentUser?: User;
  // private transcribe: Transcribe;

  session: Session | undefined;

  constructor() {
    this.botUser = new User("bot111", "bot");

    this.socket = new Socket();
    // this.inOutHelper = inOutHelper;
    // this.inOutHelper.registerInputHandler(this.userMessageHandler);

    // this.speechSynthesis = new SpeechSynthesis(this.handleSpeechSnthesisEnd);
    // this.transcribe = new Transcribe(this.inOutHelper.writeFromTranscript);

    this.newSession("defaultUser");
  }

  newSession = (userId: string) => {
    // tbd handle no user
    if (userId === "undefined") {
      this.currentState = States.NO_SESSION;
      return;
    }

    if (!(this.currentState === States.NO_SESSION)) return;

    this.session = new Session(userId);
    this.currentState = States.NEW_SESSION;

    this.startNameFinding();
  };

  async startNameFinding() {
    if (!(this.currentState === States.NEW_SESSION)) return;
    if (!this.session) return;

    this.currentState = States.NAME_FINDING;

    const nameFinder = new NameFinder(this.botUser);
    const name = await nameFinder.findName();

    this.session.user.name = name;

    console.log("Session Name:", this.session.user.name);

    this.startFortuneTeller();
  }

  startFortuneTeller() {
    if (!(this.currentState === States.NAME_FINDING)) return;
    if (!this.session) return;

    this.currentState = States.FORTUNE_TELLER;

    const fortuneTeller = new FortuneTeller(
      this.session,
      this.socket,
      this.botUser
    );
    fortuneTeller.start();
  }
}

export default State;
