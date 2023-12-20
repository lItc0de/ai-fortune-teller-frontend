import newSessionVideo from "../media/newSession0.webm";
import AFTEvent from "../messageQueue/aftEvent";
import InOutHelper from "../utils/inOutHelper";
import StoryState, { StoryIds } from "../utils/storyState";
import User from "../utils/user";
import GlassBallDrawer from "./glassBallDrawer";

class NewOldSessionDrawer {
  private newSessionVideo: HTMLVideoElement;
  private inOutHelper: InOutHelper;
  private botUser: User;
  user?: User;
  private glassBallDrawer: GlassBallDrawer;

  constructor(
    inOutHelper: InOutHelper,
    botUser: User,
    glassBallDrawer: GlassBallDrawer,
    user?: User
  ) {
    this.newSessionVideo = document.getElementById(
      "newSession0"
    ) as HTMLVideoElement;

    this.inOutHelper = inOutHelper;
    this.botUser = botUser;
    this.glassBallDrawer = glassBallDrawer;
    this.user = user;
    this.loadVideo();
  }

  abort = () => {
    this.stopAndHideVideo();
    this.inOutHelper.abort();
  };

  getAFTEvent() {
    return new AFTEvent(this.run.bind(this), this.abort);
  }

  private loadVideo() {
    this.newSessionVideo.src = newSessionVideo;
  }

  private async *run(): AsyncGenerator<StoryState, void, unknown> {
    yield new StoryState(StoryIds.WELCOME_OLD_USER1);

    await this.playVideo(this.newSessionVideo);

    yield new StoryState(StoryIds.WELCOME_OLD_USER1);

    await this.glassBallDrawer.flyIn();

    yield new StoryState(StoryIds.WELCOME_OLD_USER2);

    const writeIterator = this.inOutHelper.writeWithSynthesisIterator(
      `Welcome, welcome. What a pleasure it is to see you again ${this.user?.name}.`,
      this.botUser
    );

    for await (let _write of writeIterator) {
      yield new StoryState(StoryIds.WELCOME_OLD_USER2);
    }

    this.stopAndHideVideo();

    yield new StoryState(
      StoryIds.WELCOME_OLD_USER2,
      undefined,
      true,
      StoryIds.FORTUNE_TELLER
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

export default NewOldSessionDrawer;
