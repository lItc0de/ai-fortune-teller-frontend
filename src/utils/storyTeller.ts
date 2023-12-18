import Socket from "../socket";
import EndSessionStory from "../stories/endSessionStory";
import FortuneTellerStory from "../stories/fortuneTellerStory";
import NameFinderStory from "../stories/nameFinderStory";
import OldUserStory from "../stories/oldUserStory";
import InOutHelper from "./inOutHelper";
import StoryState, { StoryIds } from "./storyState";
import User from "./user";

class StoryTeller {
  private needsAbort = false;

  private user: User;
  private botUser: User;

  private socket: Socket;
  private inOutHelper: InOutHelper;

  private nameFinderStory: NameFinderStory;
  private oldUserStory: OldUserStory;
  private fortuneTellerStory: FortuneTellerStory;
  private endSessionStory: EndSessionStory;

  private storyState?: StoryState;
  private storyStateChangeCallback: (storyState: StoryState) => void;

  id: number;

  constructor(
    inOutHelper: InOutHelper,
    socket: Socket,
    botUser: User,
    user: User,
    storyStateChangeCallback: (storyState: StoryState) => void,
    id: number
  ) {
    this.user = user;
    this.botUser = botUser;
    this.storyStateChangeCallback = storyStateChangeCallback;

    this.socket = socket;
    this.inOutHelper = inOutHelper;

    this.nameFinderStory = new NameFinderStory(
      this.user,
      this.botUser,
      this.inOutHelper
    );
    this.oldUserStory = new OldUserStory(
      this.user,
      this.botUser,
      this.inOutHelper
    );
    this.fortuneTellerStory = new FortuneTellerStory(
      this.user,
      this.botUser,
      this.inOutHelper,
      this.socket
    );
    this.endSessionStory = new EndSessionStory(
      this.user,
      this.botUser,
      this.inOutHelper
    );

    this.id = id;
    console.log("Init StoryTeller", this.id);
  }

  async end() {
    console.log("Good bye StoryTeller", this.id);

    const endSessionStoryIterator = this.endSessionStory.tell();
    for await (let storyPart of endSessionStoryIterator) {
      if (this.needsAbort) return;
      this.updateStoryState(storyPart);
    }
  }

  async tell() {
    console.log("Tell StoryTeller", this.id);

    const isNew = !this.user.name;
    const storiesIterator = this.runStories(isNew);
    for await (let story of storiesIterator) {
      if (this.needsAbort) return;

      for await (let storyPart of story) {
        if (this.needsAbort) return;
        this.updateStoryState(storyPart);
      }
    }
  }

  abort() {
    this.needsAbort = true;
    console.log("Abort", this.id);
    this.inOutHelper.abort();
  }

  private async *runStories(
    isNew: boolean
  ): AsyncGenerator<AsyncGenerator<StoryState, void, unknown>> {
    if (isNew) {
      yield this.nameFinderStory.tell();
    } else {
      yield this.oldUserStory.tell();
    }

    yield this.fortuneTellerStory.tell();
  }

  private updateStoryState(storyState: StoryState) {
    if (this.storyState?.storyId !== storyState.storyId)
      this.storyStateChangeCallback(storyState);
    if (storyState.isEnd) this.storyStateChangeCallback(storyState);

    console.log("State", this.id, StoryIds[storyState.storyId]);

    this.storyState = storyState;
  }
}

export default StoryTeller;
