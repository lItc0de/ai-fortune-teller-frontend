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

/* globals modelParams */

// import { CheetahWorker } from "@picovoice/cheetah-web";
// import { WebVoiceProcessor } from "@picovoice/web-voice-processor";

// let cheetah: CheetahWorker | null = null;
// let fullTranscript = "";

// function transcriptCallback(cheetahTranscript: any) {
//   fullTranscript += cheetahTranscript.transcript;
//   if (cheetahTranscript.isEndpoint) {
//     fullTranscript += "\n";
//   }
// }

// async function initCheetah() {
//   cheetah = await CheetahWorker.create(
//     import.meta.env.VITE_ACCESS_KEY || "",
//     transcriptCallback,
//     { publicPath: import.meta.env.VITE_MODEL_RELATIVE_PATH },
//     { enableAutomaticPunctuation: true }
//   );
// }

// export async function startCheetah() {
//   if (!cheetah) {
//     await initCheetah();
//   }

//   if (cheetah) await WebVoiceProcessor.subscribe(cheetah);
// }

// export async function stopCheetah() {
//   if (cheetah) await WebVoiceProcessor.unsubscribe(cheetah);
// }

// let cheetah = null;

//       function writeMessage(message) {
//         console.log(message);
//         // document.getElementById("status").innerHTML = message;
//       }

//       function cheetahErrorCallback(error) {
//         writeMessage(error);
//       }

//       function cheetahTranscriptionCallback(cheetahTranscript) {
//         console.log(cheetahTranscript.transcript)
//         // document.getElementById("result").innerHTML +=
//         //   cheetahTranscript.transcript;
//         // if (cheetahTranscript.isEndpoint) {
//         //   document.getElementById("result").innerHTML += "<br>";
//         // }
//       }

//       async function startCheetah(accessKey) {
//         writeMessage("Cheetah is loading. Please wait...");
//         try {
//           cheetah = await CheetahWeb.CheetahWorker.create(
//             accessKey,
//             cheetahTranscriptionCallback,
//             { base64: modelParams },
//             { enableAutomaticPunctuation: true }
//           );

//           writeMessage("Cheetah worker ready!");

//           writeMessage(
//             "WebVoiceProcessor initializing. Microphone permissions requested ..."
//           );
//           await window.WebVoiceProcessor.WebVoiceProcessor.subscribe(cheetah);
//           writeMessage("WebVoiceProcessor ready and listening!");
//         } catch (err) {
//           cheetahErrorCallback(err);
//         }
//       }

// const startBtn = document.getElementById("startBtn");
// startBtn?.addEventListener("click", () => startCheetah('K6vl65PYUIW+mV6eiN73bVNQo0eLwS5/2BYO0BR1wqkMB9RJ5YMtLQ=='));
