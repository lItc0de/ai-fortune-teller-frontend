import SpeechSynthesis from "./speechSynthesis";
import Message from "./message";
import Transcribe from "./transcribe";
import {
  BACKGROUND_DIMENSIONS,
  countWords,
  getDimensions,
  getSentences,
  sleep,
} from "./helpers";

class InOutHelper {
  private outputArea: HTMLDivElement;
  private input: HTMLInputElement;
  private form: HTMLFormElement;

  private speechSynthesis: SpeechSynthesis;
  private transcribe: Transcribe;

  constructor() {
    this.outputArea = document.getElementById("outputArea") as HTMLDivElement;
    this.form = document.getElementById("mainForm") as HTMLFormElement;

    this.input = document.getElementById("mainInput") as HTMLInputElement;
    this.input.disabled = true;

    this.speechSynthesis = new SpeechSynthesis();
    this.transcribe = new Transcribe(this.transcribeCallback);
    this.transcribe.init();

    window.addEventListener("resize", this.resize);
    this.resize();

    this.form.addEventListener("submit", (ev) => ev.preventDefault());
  }

  abort() {
    this.clearOutputArea();
    this.transcribe.stop();
    (document.getElementById("submitBtn") as HTMLButtonElement).click();
  }

  resize = () => {
    const dimenstions = getDimensions();
    this.outputArea.style.width = `${Math.round(400 * dimenstions.ratio)}px`;
    this.outputArea.style.height = `${Math.round(
      BACKGROUND_DIMENSIONS.height * dimenstions.ratio
    )}px`;
    this.outputArea.style.right = `${Math.round(
      (window.innerWidth - dimenstions.width) / 2 + 3 * 16
    )}px`;
  };

  async *writeWithSynthesisIterator(msg: string) {
    const sentences = getSentences(msg);

    if (sentences === null) {
      await this.writeWithSynthesisHelper(msg);
      yield;
    } else {
      for (let i = 0; i < sentences.length; i++) {
        await this.writeWithSynthesisHelper(sentences[i]);
        yield;
      }
    }
  }

  async writeWithSynthesis(msg: string) {
    const sentences = getSentences(msg);

    if (sentences === null) {
      await this.writeWithSynthesisHelper(msg);
      return;
    }

    for (let i = 0; i < sentences.length; i++) {
      await this.writeWithSynthesisHelper(sentences[i]);
    }
  }

  async write(msg: string, isBot: boolean, label?: string) {
    this.showElements();
    const message = new Message(msg, isBot, label);
    this.pushMessage(message);
    await sleep(1000);
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
    this.input.style.display = "block";
  }

  hideElements() {
    this.input.style.display = "none";
  }

  private async writeWithSynthesisHelper(sentence: string, label?: string) {
    const isBot = true;
    this.write(sentence, isBot, label);
    if (!speechSynthesisEnabled) {
      if (!globalThis.fastText) {
        const wordCount = countWords(sentence);
        await sleep(1000 * Math.ceil(wordCount / 5));
      } else {
        await sleep(1000);
      }
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

  private pushMessage(message: Message) {
    const fadeOutAnimation = [
      { opacity: "1" },
      { transform: "translateY(-100px)", opacity: "0" },
    ];

    const messageElements = this.outputArea.children;
    const numOfMessages = messageElements.length;
    const firstNElements = ([...messageElements] as HTMLDivElement[]).slice(
      numOfMessages - 1
    );

    firstNElements.forEach((messageElement) => {
      messageElement.style.position = "absolute";

      const animation = messageElement.animate(fadeOutAnimation, 200);
      animation.addEventListener("finish", () => {
        messageElement.remove();
      });
    });

    this.outputArea.appendChild(message.toHtml());
  }

  clearOutputArea() {
    const fadeOutAnimation = [
      { opacity: "1" },
      { transform: "translateY(-100px)", opacity: "0" },
    ];

    const messageElements = this.outputArea.children;

    ([...messageElements] as HTMLDivElement[]).forEach((messageElement) => {
      messageElement.style.position = "absolute";

      const animation = messageElement.animate(fadeOutAnimation, 200);
      animation.addEventListener("finish", () => {
        messageElement.remove();
      });
    });
  }
}

export default InOutHelper;
