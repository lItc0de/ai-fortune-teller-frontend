import SpeechSynthesis from "../speechSynthesis";
import User from "./user";
import Message from "./message";
import Transcribe from "../transcribe";
import { countWords, getDimensions, getSentences, pause } from "./helpers";

declare global {
  var cheetahEnabled: boolean;
  var speechSynthesisEnabled: boolean;
}

class InOutHelper {
  private output: HTMLOutputElement;
  private input: HTMLInputElement;
  private form: HTMLFormElement;

  private speechSynthesis: SpeechSynthesis;
  private transcribe: Transcribe;

  private messages: Message[] = [];

  constructor() {
    this.output = document.getElementById("aiOutput") as HTMLOutputElement;
    this.form = document.getElementById("mainForm") as HTMLFormElement;

    this.input = document.getElementById("mainInput") as HTMLInputElement;
    this.input.disabled = true;

    this.speechSynthesis = new SpeechSynthesis();
    this.transcribe = new Transcribe(this.transcribeCallback);
    this.transcribe.init();

    window.addEventListener("resize", this.resize);
    this.resize();
  }

  resize = () => {
    const dimenstions = getDimensions();
    this.output.style.width = `${400 * dimenstions.ratio}px`;
    this.output.style.height = `${500 * dimenstions.ratio}px`;
    this.output.style.right = `${
      (window.innerWidth - dimenstions.width) / 2 + 50
    }px`;
  };

  async writeWithSynthesis(msg: string, user?: User) {
    const sentences = getSentences(msg);

    if (sentences === null) {
      await this.writeWithSynthesisHelper(msg, user);
      return;
    }

    for (let i = 0; i < sentences.length; i++) {
      await this.writeWithSynthesisHelper(sentences[i], user);
    }
  }

  write(msg: string, user?: User) {
    this.showElements();
    const message = new Message(msg, user);
    this.messages.push(message);
    this.messages = this.messages.slice(-2);
    this.output.innerHTML = this.messages
      .map((message) => message.toString())
      .join("");
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
      this.transcribe.start();
    });

  showElements() {
    this.output.style.display = "block";
    this.input.style.display = "block";
  }

  hideElements() {
    this.output.style.display = "none";
    this.input.style.display = "none";
  }

  removeEventListeners() {
    this.form.replaceWith(this.form.cloneNode(true));
    this.form = document.getElementById("mainForm") as HTMLFormElement;
    this.input = document.getElementById("mainInput") as HTMLInputElement;
  }

  private async writeWithSynthesisHelper(sentence: string, user?: User) {
    this.write(sentence, user);
    if (!speechSynthesisEnabled) {
      const wordCount = countWords(sentence);
      await pause(1500 * Math.ceil(wordCount / 5));
      return;
    }

    await this.speechSynthesis.speak(sentence);
  }

  private transcribeCallback = (transcript: string) => {
    this.input.value = transcript;
    (document.getElementById("submitBtn") as HTMLButtonElement).click();
  };

  private handleSubmit = (ev: any) => {
    ev.preventDefault();

    const value = this.input.value;
    this.input.value = "";
    return value;
  };
}

export default InOutHelper;
