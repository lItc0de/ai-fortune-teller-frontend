import newSession1Video from "../media/newSession1.mp4";
import GlassBallHelper from "./glassBallHelper";

class FortuneTellerNewSessionDrawer {
  private newSession1Video: HTMLVideoElement;

  constructor() {
    this.newSession1Video = document.getElementById(
      "newSession1"
    ) as HTMLVideoElement;

    this.loadVideo();
  }

  private loadVideo() {
    this.newSession1Video.src = newSession1Video;
  }

  async drawNewSessionAnimation(glassBallHelper: GlassBallHelper) {
    await this.playVideo();
    await glassBallHelper.flyIn();
  }

  hideVideo() {
    this.newSession1Video.style.display = "none";
    this.newSession1Video.currentTime = 0;
  }

  private playVideo = () =>
    new Promise((resolve) => {
      this.newSession1Video.style.display = "block";
      this.newSession1Video.addEventListener("ended", resolve);
      this.newSession1Video.play();
    });
}

export default FortuneTellerNewSessionDrawer;
