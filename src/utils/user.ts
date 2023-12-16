import Session from "./session";

type UserType = "bot" | "person";

class User {
  id: string;
  type: UserType;
  name?: string;
  sessions: Session[] = [];
  currentSession?: Session;

  constructor(id: string, type: UserType) {
    this.id = id;
    this.type = type;
  }

  newSession() {
    const session = new Session();
    this.sessions.push(session);
    this.currentSession = session;
  }

  endSession() {
    this.currentSession?.end();
    this.currentSession = undefined;
  }
}

export default User;
