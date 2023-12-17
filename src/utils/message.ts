import User, { UserType } from "./user";

class Message {
  user?: User;
  text: string;

  constructor(text: string, user?: User) {
    this.text = text;
    this.user = user;
  }

  private getUser(): string {
    if (!this.user) return "";

    if (this.user.type === UserType.BOT) return "Fortune Teller: ";

    return this.user.name ? `${this.user.name}: ` : "User: ";
  }

  toString(): string {
    return [this.getUser(), this.text, "<br>"].join("");
  }
}

export default Message;
