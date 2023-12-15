class Session {
  startedAt: number;
  endedAt?: number;

  constructor() {
    this.startedAt = Date.now();
  }

  end() {
    this.endedAt = Date.now();
  }
}

export default Session;
