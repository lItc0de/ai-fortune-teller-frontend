class SpeechSynthesis {
  private synth: globalThis.SpeechSynthesis;
  private voice: SpeechSynthesisVoice;
  private endCallback: () => void;

  constructor(endCallback: () => void) {
    this.synth = window.speechSynthesis;
    this.voice = this.synth.getVoices()[0];
    this.endCallback = endCallback;
  }

  speak(text: string) {
    const utterThis = new SpeechSynthesisUtterance(text);
    utterThis.voice = this.voice;
    utterThis.addEventListener("end", this.endCallback);

    this.synth.speak(utterThis);
  }
}

export default SpeechSynthesis;
