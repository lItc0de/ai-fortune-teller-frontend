import User, { UserType } from "../user";

class Message {
  user?: User;
  text: string;

  constructor(text: string, user?: User) {
    this.text = text;
    this.user = user;
  }

  private getUser(): string {
    if (!this.user) return "";

    if (this.user.type === UserType.BOT) return "Fortune Teller";

    return this.user.name ? `${this.user.name}` : "You";
  }

  toString(): string {
    return [this.getUser(), this.text, "<br>"].join("");
  }

  toHtml(): HTMLDivElement {
    const wrapper = document.createElement("div");
    wrapper.className = "outputWrapper";

    if (this.user) {
      const label = document.createElement("label");
      label.className = "outputLabel";
      label.textContent = this.getUser();
      wrapper.appendChild(label);
    }

    const output = document.createElement("output");
    output.className = "output";
    output.textContent = this.text;

    wrapper.appendChild(output);

    return wrapper;
  }
}

export default Message;
