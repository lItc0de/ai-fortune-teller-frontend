import newSession1Video from "../media/newSession1.webm";
import newSession2Video from "../media/newSession2.webm";
import newSession3Video from "../media/newSession3.webm";
import newSession4Video from "../media/newSession4.webm";
import InOutHelper from "../utils/inOutHelper";
import StateReturn from "../utils/stateReturn";
import GlassBallDrawer from "../utils/drawers/glassBallBaseDrawer";
import BaseEvent from "./baseEvent";
import Socket from "../socket";
import SocketMessage, { SocketMessageType } from "../utils/socketMessage";
import { StateId } from "../constants";

class NewUserSessionEvent extends BaseEvent {
  private newSession1Video: HTMLVideoElement;
  private newSession2Video: HTMLVideoElement;
  private newSession3Video: HTMLVideoElement;
  private newSession4Video: HTMLVideoElement;
  private glassBallDrawer: GlassBallDrawer;
  private socket: Socket;

  constructor(
    inOutHelper: InOutHelper,
    glassBallDrawer: GlassBallDrawer,
    socket: Socket
  ) {
    super(inOutHelper);
    this.newSession1Video = document.getElementById(
      "newSession1"
    ) as HTMLVideoElement;

    this.newSession2Video = document.getElementById(
      "newSession2"
    ) as HTMLVideoElement;

    this.newSession3Video = document.getElementById(
      "newSession3"
    ) as HTMLVideoElement;

    this.newSession4Video = document.getElementById(
      "newSession4"
    ) as HTMLVideoElement;

    this.loadVideos();
    this.glassBallDrawer = glassBallDrawer;
    this.socket = socket;
  }

  async abort() {
    this.stopAndHideVideos();
    this.inOutHelper.abort();
  }

  private loadVideos() {
    this.newSession1Video.src = newSession1Video;
    this.newSession2Video.src = newSession2Video;
    this.newSession3Video.src = newSession3Video;
    this.newSession4Video.src = newSession4Video;
  }

  async *eventIterator(): AsyncGenerator<StateReturn, void, unknown> {
    yield new StateReturn(StateId.INTRO1);
    this.socket.send(new SocketMessage(SocketMessageType.NEW_SESSION));

    this.playVideo(this.newSession1Video);
    const writeIterator1 = this.inOutHelper.writeWithSynthesisIterator(
      "Welcome, welcome. What a pleasure it is to see that fates have crossed our paths as two souls keen on the mystic arts of fortune telling."
    );
    for await (const _write of writeIterator1) {
      yield new StateReturn(StateId.INTRO1);
    }

    this.newSession1Video.style.display = "none";
    this.newSession1Video.currentTime = 0;
    yield new StateReturn(StateId.INTRO1);

    this.playVideo(this.newSession2Video);
    const writeIterator2 = this.inOutHelper.writeWithSynthesisIterator(
      "That sparkle in your eyes carries the burden of both curiosity and mockery, so let us embark on a journey across the spiritual realms with the help of some… uh… artificial intelligence."
    );
    for await (const _write of writeIterator2) {
      yield new StateReturn(StateId.INTRO1);
    }

    this.newSession2Video.style.display = "none";
    this.newSession2Video.currentTime = 0;
    yield new StateReturn(StateId.INTRO1);

    let needsINTRO2 = false;
    (async (): Promise<void> => {
      await this.playAndHideVideo(this.newSession3Video);
      await Promise.all([
        this.playVideo(this.newSession4Video),
        (async (): Promise<void> => {
          await this.glassBallDrawer.flyIn();
          needsINTRO2 = true;
        })(),
      ]);
    })();
    const writeIterator3 = this.inOutHelper.writeWithSynthesisIterator(
      "Out of millions of stars in the galaxy, one has made you into who you are today; and to foresee how its energy will flow through you in the days and years to come, I will need to see through to your soul and learn your true identity. And, in good old AI fashion, your name should be enough to see right through you."
    );
    for await (const _write of writeIterator3) {
      yield new StateReturn(needsINTRO2 ? StateId.INTRO2 : StateId.INTRO1);
    }

    this.newSession4Video.style.display = "none";
    this.newSession4Video.currentTime = 0;

    yield new StateReturn(
      StateId.INTRO2,
      undefined,
      true,
      StateId.NAME_FINDING
    );
  }

  private async playAndHideVideo(videoEl: HTMLVideoElement) {
    await this.playVideo(videoEl);
    videoEl.style.display = "none";
    videoEl.currentTime = 0;
  }

  private playVideo = (videoEl: HTMLVideoElement) =>
    new Promise((resolve) => {
      videoEl.style.display = "block";

      videoEl.addEventListener("ended", resolve);
      videoEl.play();
    });

  stopAndHideVideos() {
    this.newSession1Video.style.display = "none";
    this.newSession2Video.style.display = "none";
    this.newSession3Video.style.display = "none";
    this.newSession4Video.style.display = "none";
  }
}

export default NewUserSessionEvent;
