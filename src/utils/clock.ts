// from https://github.com/mrdoob/three.js/blob/master/src/core/Clock.js

class Clock {
  private autoStart: boolean;
  private startTime: number;
  private oldTime: number;
  private elapsedTime: number;
  running: boolean;

  constructor(autoStart = true) {
    this.autoStart = autoStart;

    this.startTime = 0;
    this.oldTime = 0;
    this.elapsedTime = 0;

    this.running = false;
  }

  start() {
    this.startTime = now();

    this.oldTime = this.startTime;
    this.elapsedTime = 0;
    this.running = true;
  }

  stop() {
    this.getElapsedTime();
    this.running = false;
    this.autoStart = false;
  }

  getElapsedTime() {
    this.getDelta();
    return this.elapsedTime;
  }

  getDelta() {
    let diff = 0;

    if (this.autoStart && !this.running) {
      this.start();
      return 0;
    }

    if (this.running) {
      const newTime = now();

      diff = (newTime - this.oldTime) / 1000;
      this.oldTime = newTime;

      this.elapsedTime += diff;
    }

    return diff;
  }
}

function now() {
  return (typeof performance === "undefined" ? Date : performance).now(); // see #10732
}

export default Clock;
