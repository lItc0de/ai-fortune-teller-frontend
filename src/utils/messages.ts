import User from "../user";
import Message from "./message";

class Messages {
  private messages: Message[] = [];

  add(msg: string, user: User) {
    this.messages.push(new Message(msg, user));
  }

  toString(): string {
    return this.messages.reduce((prev, curr) => {
      const newMessage = curr.toString();
      return prev + newMessage;
    }, "");
  }
}

export default Messages;