import User from "../user";

class Message {
  user: User;
  text: string;

  constructor(text: string, user: User) {
    this.text = text;
    this.user = user;
  }

  private getUser(): string {
    if (this.user.type === "bot") return "Fortune Teller:";

    return this.user.id ? `${this.user.id}:` : "User:";
  }

  toString(): string {
    return `${this.getUser()} ${this.text}<br>`;
  }
}

export default Message;
