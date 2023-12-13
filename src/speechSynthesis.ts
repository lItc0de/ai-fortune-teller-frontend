class SpeechSynthesis {
  private synth: globalThis.SpeechSynthesis;
  private voice: SpeechSynthesisVoice;

  constructor() {
    this.synth = window.speechSynthesis;
    this.voice = this.synth.getVoices()[0];
  }

  speak(text: string) {
    const utterThis = new SpeechSynthesisUtterance(text);
    utterThis.voice = this.voice;
    this.synth.speak(utterThis);
  }
}

export default SpeechSynthesis;
