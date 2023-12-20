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
    if (!globalThis.cheetahEnabled) return;
    if (!this.cheetah) return;
    console.log("Transcription started");

    this.showMicrophone();
    await WebVoiceProcessor.subscribe(this.cheetah);
  }

  async stop() {
    this.hideMicrophone();
    if (this.cheetah) await WebVoiceProcessor.unsubscribe(this.cheetah);
    console.log("Transcription stopped");
  }

  private transcriptCallback = (cheetahTranscript: CheetahTranscript) => {
    this.transcript += cheetahTranscript.transcript;

    if (!cheetahTranscript.isEndpoint) return;

    this.callback(this.transcript);

    this.transcript = "";

    this.stop();
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
}

export default Transcribe;
