import { pause, sleep } from "../utils/helpers";
import StoryState, { StoryIds } from "../utils/storyState";
import AFTEvent from "./aftEvent";

class EventLoop {
  private looping = false;
  private eventQueue = new Map<string, AFTEvent>();
  private currentEventIterator?: AsyncGenerator<
    StoryState | null,
    undefined,
    unknown
  >;
  private currentEventKey?: string;
  private onEventFinished?: (returnValue: StoryState) => void;
  onStoryStateChange?: (storyState: StoryState) => void;

  start() {
    if (this.looping) return;
    this.looping = true;
    this.mainLoop();
  }

  // async test() {
  //   this.addEvent(new AFTEvent("beforeAbort1"));
  //   this.addEvent(new AFTEvent("beforeAbort2"));
  //   this.mainLoop();
  //   this.addEvent(new AFTEvent("beforeAbort3"));
  //   this.addEvent(new AFTEvent("beforeAbort4"));

  //   await pause(1000);
  //   this.addEvent(new AFTEvent("beforeAbort5"));

  //   await pause(1000);
  //   this.addEvent(new AFTEvent("beforeAbort6"));
  //   this.addEvent(new AFTEvent("beforeAbort7"));
  //   this.addEvent(new AFTEvent("beforeAbort8"));
  //   this.eventQueue.clear();
  //   // const returnValue = await this.clear();
  //   // console.log({ returnValue });

  //   this.addEvent(new AFTEvent("afterAbort9"));
  //   this.addEvent(new AFTEvent("afterAbort10"));

  //   await pause(1000);
  //   this.addEvent(new AFTEvent("afterAbort11"));

  //   await pause(10000);
  //   this.addEvent(new AFTEvent("afterAbort12"));
  // }

  enqueue(aftEvent: AFTEvent | AFTEvent[]) {
    if (Array.isArray(aftEvent)) {
      aftEvent.forEach(this.addEvent);
      return;
    }

    this.addEvent(aftEvent);
  }

  private addEvent(aftEvent: AFTEvent) {
    const key = crypto.randomUUID();
    this.eventQueue.set(key, aftEvent);
  }

  clear = (): Promise<StoryState> =>
    new Promise(async (resolve) => {
      console.log("Clear called");

      if (this.currentEventKey && this.eventQueue.has(this.currentEventKey)) {
        const currentEvent = this.eventQueue.get(this.currentEventKey);
        await currentEvent?.abort();
      }
      this.eventQueue.clear();
      this.currentEventKey = undefined;
      this.currentEventIterator = undefined;

      this.onEventFinished = (returnValue: StoryState) => {
        this.onEventFinished = undefined;
        console.log("Clear finished");
        return resolve(returnValue);
      };
    });

  private async mainLoop() {
    do {
      if (this.currentEventIterator === undefined)
        this.currentEventIterator = this.createEventIterator();

      try {
        const res = await this.currentEventIterator.next();
        if (this.onEventFinished)
          this.onEventFinished(
            res.value || new StoryState(StoryIds.NO_SESSION)
          );
        if (!res || !res.value) continue;
        if (this.onStoryStateChange) this.onStoryStateChange(res.value);
      } catch (error) {
        this.looping = false;
        this.clear();
        this.start();
        break;
      }

      await sleep();
    } while (this.looping);
  }

  private async *createEventIterator(): AsyncGenerator<
    StoryState | null,
    undefined,
    unknown
  > {
    while (this.looping) {
      if (this.eventQueue.size === 0) {
        await pause(100);
        yield null;
      } else {
        for (let [key, aftEvent] of this.eventQueue.entries()) {
          if (this.currentEventKey === undefined) {
            this.currentEventKey = key;

            for await (let eventPart of aftEvent.eventIterator()) {
              console.log("next event part");
              yield eventPart;
            }

            this.eventQueue.delete(key);
            this.currentEventKey = undefined;
          } else {
            console.error("Key was not undefined");
            // throw new Error("Key was not undefined");
            yield new StoryState(StoryIds.NO_SESSION);
          }
        }
      }
    }
  }
}

export default EventLoop;
