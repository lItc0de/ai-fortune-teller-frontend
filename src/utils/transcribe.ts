declare global {
  var modelParams: string;
}

import { type CheetahTranscript, CheetahWorker } from "@picovoice/cheetah-web";
import { WebVoiceProcessor } from "@picovoice/web-voice-processor";
import microphoneImg from "../media/microphone.svg";

class Transcribe {
  private cheetah?: CheetahWorker;
  private transcript: string = "";
  private callback: (transcript: string) => void;
  private microphoneImg: HTMLImageElement;
  private keyPressed = false;
  private cancelTimeout?: any;

  constructor(callback: (transcript: string) => void) {
    this.callback = callback;

    this.microphoneImg = document.getElementById(
      "microphoneImg"
    ) as HTMLImageElement;
    this.loadMicrophoneImg();
  }

  async init() {
    if (!globalThis.cheetahEnabled) return;

    this.cheetah = await CheetahWorker.create(
      import.meta.env.VITE_ACCESS_KEY || "",
      this.transcriptCallback,
      { base64: modelParams },
      { enableAutomaticPunctuation: true }
    );
  }

  async start() {
    this.addEventListener();
  }

  async stop() {
    this.removeEventListener();
  }

  private stopTranscribing() {
    window.clearTimeout(this.cancelTimeout);

    if (!globalThis.cheetahEnabled) return;
    if (!this.cheetah) return;

    WebVoiceProcessor.unsubscribe(this.cheetah);
  }

  private transcriptCallback = (cheetahTranscript: CheetahTranscript) => {
    this.transcript += cheetahTranscript.transcript;

    if (cheetahTranscript.isEndpoint) this.transcript += " ";

    this.callback(this.transcript);

    if (!this.keyPressed) this.stopTranscribing();
  };

  private loadMicrophoneImg() {
    this.microphoneImg.src = microphoneImg;
  }

  private showMicrophone() {
    this.microphoneImg.style.display = "block";
  }

  private hideMicrophone() {
    this.microphoneImg.style.display = "none";
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (this.keyPressed) return;
    if (e.key !== "Alt") return;

    this.keyPressed = true;

    if (!globalThis.cheetahEnabled) return;
    if (!this.cheetah) return;

    this.showMicrophone();
    WebVoiceProcessor.subscribe(this.cheetah);
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    if (!this.keyPressed) return;
    if (e.key !== "Alt") return;

    this.keyPressed = false;
    this.hideMicrophone();
    this.transcript = "";

    this.cancelTimeout = window.setTimeout(() => this.stopTranscribing(), 5000);
  };

  private addEventListener() {
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);
  }

  private removeEventListener() {
    document.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("keyup", this.handleKeyUp);
  }
}

export default Transcribe;
