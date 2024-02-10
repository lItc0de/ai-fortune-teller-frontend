class TTSDisabledError extends Error {
  constructor() {
    super("TTS Disabled");
  }
}

export default TTSDisabledError;
