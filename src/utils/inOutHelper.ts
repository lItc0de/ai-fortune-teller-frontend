import SpeechSynthesis from "../speechSynthesis";
import User from "../user";
import Message from "./message";

declare global {
  var cheetahEnabled: boolean;
  var speechSynthesisEnabled: boolean;
}

class InOutHelper {
  private output: HTMLOutputElement;
  private input: HTMLInputElement;
  private form: HTMLFormElement;

  private speechSynthesis: SpeechSynthesis;

  constructor() {
    this.output = document.getElementById("aiOutput") as HTMLOutputElement;
    this.input = document.getElementById("mainInput") as HTMLInputElement;
    this.form = document.getElementById("mainForm") as HTMLFormElement;

    this.speechSynthesis = new SpeechSynthesis();

    this.input.disabled = true;
  }

  async writeWithSynthesis(msg: string, user?: User) {
    this.write(msg, user);
    if (!speechSynthesisEnabled) return;

    await this.speechSynthesis.speak(msg);
  }

  write(msg: string, user?: User) {
    let message = msg;
    if (user) message = this.newMessage(msg, user).toString();
    this.output.innerHTML = message;
  }

  toggleDisabled(disabled: boolean) {
    this.input.disabled = disabled;
    if (!disabled) this.input.focus();
  }

  waitForUserInput = (): Promise<string> =>
    new Promise((resolve) => {
      const handleSubmit = (ev: any) => {
        this.form.removeEventListener("submit", handleSubmit);
        this.toggleDisabled(true);
        return resolve(this.handleSubmit(ev));
      };
      this.form.addEventListener("submit", handleSubmit);
      this.toggleDisabled(false);
    });

  private handleSubmit = (ev: any) => {
    ev.preventDefault();

    const value = this.input.value;
    this.input.value = "";
    return value;
  };

  private newMessage(msg: string, user: User): Message {
    return new Message(msg, user);
  }
}

export default InOutHelper;
