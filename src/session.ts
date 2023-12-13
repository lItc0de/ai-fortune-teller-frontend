import User from "./user";
import Messages from "./utils/messages";

class Session {
  user: User;
  messages: Messages;

  constructor(userId: string) {
    this.user = new User(userId, "person");
    this.messages = new Messages();
  }
}

export default Session;
