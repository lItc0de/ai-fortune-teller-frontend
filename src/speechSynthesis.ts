class SpeechSynthesis {
  private synth: globalThis.SpeechSynthesis;
  private voice: SpeechSynthesisVoice;

  constructor() {
    this.synth = window.speechSynthesis;
    this.voice = this.synth.getVoices()[0];
  }

  speak = (text: string): Promise<void> =>
    new Promise((reslove) => {
      const utterThis = new SpeechSynthesisUtterance(text);
      utterThis.voice = this.voice;
      utterThis.addEventListener("end", () => reslove());

      this.synth.speak(utterThis);
    });
}

export default SpeechSynthesis;
