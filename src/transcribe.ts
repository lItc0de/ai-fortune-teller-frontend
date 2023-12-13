declare global {
  var modelParams: string;
}

import { type CheetahTranscript, CheetahWorker } from "@picovoice/cheetah-web";
import { WebVoiceProcessor } from "@picovoice/web-voice-processor";

let cheetah: CheetahWorker | null = null;
let fullTranscript = "";

function transcriptCallback(cheetahTranscript: CheetahTranscript) {
  fullTranscript += cheetahTranscript.transcript;
  if (cheetahTranscript.isEndpoint) {
    fullTranscript += "\n";
  }

  console.log(fullTranscript);
}

async function initCheetah() {
  console.log("starting");

  cheetah = await CheetahWorker.create(
    import.meta.env.VITE_ACCESS_KEY || "",
    transcriptCallback,
    { base64: modelParams },
    { enableAutomaticPunctuation: true }
  );
}

export async function startCheetah() {
  if (!cheetah) {
    await initCheetah();
  }

  if (cheetah) await WebVoiceProcessor.subscribe(cheetah);
}

export async function stopCheetah() {
  if (cheetah) await WebVoiceProcessor.unsubscribe(cheetah);
}
