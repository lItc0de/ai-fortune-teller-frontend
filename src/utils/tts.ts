const BACKEND_URL = `${import.meta.env.VITE_BACKEND_URL}`;

class TTS {
  private ctx: AudioContext;
  private audio?: AudioBuffer;
  private player?: AudioBufferSourceNode;

  constructor() {
    this.ctx = new AudioContext();
  }

  transcribe = async (text: string) => {
    const res = await fetch([BACKEND_URL, "tts"].join("/"), {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    const audioBuffer = await res.arrayBuffer();
    this.audio = await this.ctx.decodeAudioData(audioBuffer);
  };

  play = () =>
    new Promise<void>((resolve) => {
      if (!this.audio) return resolve();

      this.player = this.ctx.createBufferSource();
      this.player.buffer = this.audio;
      this.player.connect(this.ctx.destination);

      const handleEnded = () => {
        this.player?.removeEventListener("ended", handleEnded);
        resolve();
      };

      this.player?.addEventListener("ended", handleEnded);
      this.player?.start(this.ctx.currentTime);
    });
}

export default TTS;
