import { StateId } from "../state";
import { pause, sleep } from "../utils/helpers";
import StateReturn from "../utils/stateReturn";
import AFTEvent from "./aftEvent";

class EventLoop {
  private looping = false;
  private eventQueue = new Map<string, AFTEvent>();
  private currentEventIterator?: AsyncGenerator<
    StateReturn | null,
    undefined,
    unknown
  >;
  private currentEventKey?: string;
  private onEventFinished?: (returnValue: StateReturn) => void;
  onStoryStateChange?: (stateReturn: StateReturn) => void;

  start() {
    if (this.looping) return;
    this.looping = true;
    this.mainLoop();
  }

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

  clear = (): Promise<StateReturn> =>
    new Promise(async (resolve) => {
      console.log("Clear called");

      if (this.currentEventKey && this.eventQueue.has(this.currentEventKey)) {
        const currentEvent = this.eventQueue.get(this.currentEventKey);
        await currentEvent?.abort();
      }
      this.eventQueue.clear();
      this.currentEventKey = undefined;
      this.currentEventIterator = undefined;

      this.onEventFinished = (returnValue: StateReturn) => {
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
            res.value || new StateReturn(StateId.NO_SESSION)
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
    StateReturn | null,
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
            yield new StateReturn(StateId.NO_SESSION);
          }
        }
      }
    }
  }
}

export default EventLoop;
