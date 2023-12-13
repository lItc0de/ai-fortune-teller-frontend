declare global {
  var modelParams: string;
}

import { type CheetahTranscript, CheetahWorker } from "@picovoice/cheetah-web";
import { WebVoiceProcessor } from "@picovoice/web-voice-processor";

class Transcribe {
  private cheetah?: CheetahWorker;
  private transcript: string = "";
  private writeCallback: (transcript: string) => void;

  constructor(writeCallback: (transcript: string) => void) {
    this.writeCallback = writeCallback;
  }

  async init() {
    this.cheetah = await CheetahWorker.create(
      import.meta.env.VITE_ACCESS_KEY || "",
      this.transcriptCallback,
      { base64: modelParams },
      { enableAutomaticPunctuation: true }
    );
  }

  async start() {
    if (!this.cheetah) {
      await this.init();
    }

    console.log("Transcribing started");

    if (this.cheetah) await WebVoiceProcessor.subscribe(this.cheetah);
  }

  async stop() {
    if (this.cheetah) await WebVoiceProcessor.unsubscribe(this.cheetah);
  }

  private transcriptCallback = (cheetahTranscript: CheetahTranscript) => {
    this.transcript += cheetahTranscript.transcript;

    if (!cheetahTranscript.isEndpoint) return;

    this.writeCallback(this.transcript);

    this.transcript = "";
  };
}

export default Transcribe;
