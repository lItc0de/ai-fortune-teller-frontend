import newSessionVideo from "../media/newSession0.webm";
import InOutHelper from "../utils/inOutHelper";
import StateReturn from "../utils/stateReturn";
import User from "../user";
import GlassBallDrawer from "../utils/drawers/glassBallBaseDrawer";
import BaseEvent from "./baseEvent";
import Socket from "../socket";
import SocketMessage, { SocketMessageType } from "../utils/socketMessage";
import { StateId } from "../constants";

class NewKnownUserSessionEvent extends BaseEvent {
  private newSessionVideo: HTMLVideoElement;
  private glassBallDrawer: GlassBallDrawer;
  private socket: Socket;

  constructor(
    inOutHelper: InOutHelper,
    glassBallDrawer: GlassBallDrawer,
    socket: Socket,
    user?: User
  ) {
    super(inOutHelper, user);

    this.newSessionVideo = document.getElementById(
      "newSession0"
    ) as HTMLVideoElement;

    this.glassBallDrawer = glassBallDrawer;
    this.socket = socket;
    this.loadVideo();
  }

  async abort() {
    this.stopAndHideVideo();
    this.inOutHelper.abort();
  }

  private loadVideo() {
    this.newSessionVideo.src = newSessionVideo;
  }

  async *eventIterator(): AsyncGenerator<StateReturn, void, unknown> {
    yield new StateReturn(StateId.WELCOME_OLD_USER1);

    this.socket.send(
      new SocketMessage(
        SocketMessageType.OLD_SESSION,
        undefined,
        this.user?.name
      )
    );

    await this.playVideo(this.newSessionVideo);

    yield new StateReturn(StateId.WELCOME_OLD_USER1);

    await this.glassBallDrawer.flyIn();

    yield new StateReturn(StateId.WELCOME_OLD_USER2);

    const writeIterator = this.inOutHelper.writeWithSynthesisIterator(
      `Welcome, welcome. What a pleasure it is to see you again ${this.user?.name}.`
    );

    for await (const _write of writeIterator) {
      yield new StateReturn(StateId.WELCOME_OLD_USER2);
    }

    this.stopAndHideVideo();

    yield new StateReturn(
      StateId.WELCOME_OLD_USER2,
      undefined,
      true,
      StateId.FORTUNE_TELLER
    );
  }

  private playVideo = (videoEl: HTMLVideoElement) =>
    new Promise((resolve) => {
      videoEl.style.display = "block";
      videoEl.playbackRate = 2;

      videoEl.addEventListener("ended", resolve);
      videoEl.play();
    });

  stopAndHideVideo() {
    this.newSessionVideo.style.display = "none";
  }
}

export default NewKnownUserSessionEvent;
