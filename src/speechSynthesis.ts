class SpeechSynthesis {
  private synth: globalThis.SpeechSynthesis;
  private voice: SpeechSynthesisVoice;

  constructor() {
    this.synth = window.speechSynthesis;
    this.voice = this.getVoice();
  }

  speak = (text: string): Promise<void> =>
    new Promise((reslove) => {
      const utterThis = new SpeechSynthesisUtterance(text);
      utterThis.lang = "en-US";
      this.synth.getVoices()[0];

      utterThis.lang = "en-US";
      utterThis.pitch = 1;
      utterThis.rate = 1;
      utterThis.voice = this.voice;

      const handleEnd = () => {
        utterThis.removeEventListener("end", handleEnd);
        return reslove();
      };

      utterThis.addEventListener("end", handleEnd);

      this.synth.speak(utterThis);
    });

  private getVoice(): SpeechSynthesisVoice {
    const voices = this.synth.getVoices();
    const foundVoice = voices.find((voice) => {
      return voice.name === "Sandy (English (US))";
    });

    return foundVoice || voices[0];
  }
}

export default SpeechSynthesis;
