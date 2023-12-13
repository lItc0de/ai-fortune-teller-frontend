import Session from "./session";

class State {
  waiting = false;
  session: Session | undefined;

  newSession(userId: string) {
    this.session = new Session(userId);
    this.waiting = false;
  }
}

export default State;
