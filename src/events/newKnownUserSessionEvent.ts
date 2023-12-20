import newSessionVideo from "../media/newSession0.webm";
import { StateId } from "../state";
import InOutHelper from "../utils/inOutHelper";
import StateReturn from "../utils/stateReturn";
import User from "../utils/user";
import GlassBallDrawer from "../utils/glassBallDrawer";
import BaseEvent from "./baseEvent";

class NewKnownUserSessionEvent extends BaseEvent {
  private newSessionVideo: HTMLVideoElement;
  private glassBallDrawer: GlassBallDrawer;

  constructor(
    user: User,
    botUser: User,
    inOutHelper: InOutHelper,
    glassBallDrawer: GlassBallDrawer
  ) {
    super(botUser, inOutHelper, user);

    this.newSessionVideo = document.getElementById(
      "newSession0"
    ) as HTMLVideoElement;

    this.inOutHelper = inOutHelper;
    this.botUser = botUser;
    this.glassBallDrawer = glassBallDrawer;
    this.user = user;
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

    await this.playVideo(this.newSessionVideo);

    yield new StateReturn(StateId.WELCOME_OLD_USER1);

    await this.glassBallDrawer.flyIn();

    yield new StateReturn(StateId.WELCOME_OLD_USER2);

    const writeIterator = this.inOutHelper.writeWithSynthesisIterator(
      `Welcome, welcome. What a pleasure it is to see you again ${this.user?.name}.`,
      this.botUser
    );

    for await (let _write of writeIterator) {
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
