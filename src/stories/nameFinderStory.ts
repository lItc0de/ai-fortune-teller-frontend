import User from "../utils/user";
import InOutHelper from "../utils/inOutHelper";
import BaseStory from "./baseStory";
import StateReturn from "../utils/stateReturn";
import { countWords } from "../utils/helpers";
import AFTEvent from "../messageQueue/aftEvent";
import { StateId } from "../state";

class NameFinderStory extends BaseStory {
  constructor(user: User, botUser: User, inOutHelper: InOutHelper) {
    super(user, botUser, inOutHelper);
  }

  abort = () => {
    this.inOutHelper.abort();
  };

  getAFTEvent() {
    return new AFTEvent(this.tell.bind(this), this.abort);
  }

  async *tell() {
    yield new StateReturn(StateId.NAME_FINDING);
    await this.inOutHelper.writeWithSynthesis(
      "So now I ask you to speak your name!",
      this.botUser
    );
    yield new StateReturn(StateId.NAME_FINDING);

    let name;
    let findName = true;
    while (findName) {
      let askForName = true;
      while (askForName) {
        name = (await this.inOutHelper.waitForUserInput())
          .trim()
          .replace(".", "");
        await this.inOutHelper.write(name, this.user);
        yield new StateReturn(StateId.NAME_FINDING);

        if (countWords(name) !== 1) {
          await this.inOutHelper.writeWithSynthesis(
            "Oh dear, unfortunately your name got lost in the void, repeat it for me please!",
            this.botUser
          );
        } else {
          askForName = false;
        }
        yield new StateReturn(StateId.NAME_FINDING);
      }

      await this.inOutHelper.writeWithSynthesis(
        `So your name is ${name}? A short "yes" or "no" is enough.`,
        this.botUser
      );

      yield new StateReturn(StateId.NAME_FINDING);

      let checkIfName = true;
      while (checkIfName) {
        const answer = (await this.inOutHelper.waitForUserInput())
          .trim()
          .toLowerCase()
          .replace(".", "");
        await this.inOutHelper.write(answer, this.user);

        yield new StateReturn(StateId.NAME_FINDING);

        if (answer === "no") {
          await this.inOutHelper.writeWithSynthesis(
            "Ok, well then tell me your name again.",
            this.botUser
          );
          checkIfName = false;
          yield new StateReturn(StateId.NAME_FINDING);
        } else if (answer === "yes") {
          checkIfName = false;
          findName = false;
          yield new StateReturn(StateId.NAME_FINDING);
        } else {
          await this.inOutHelper.writeWithSynthesis(
            'Please my dear, a short "yes" or "no" is enough.',
            this.botUser
          );
          yield new StateReturn(StateId.NAME_FINDING);
        }
      }
    }

    await this.inOutHelper.writeWithSynthesis(
      `Hello my dear ${name}, a beautiful name that is.`,
      this.botUser
    );

    this.user.name = name;
    yield new StateReturn(
      StateId.NAME_FINDING,
      name,
      true,
      StateId.FORTUNE_TELLER
    );
  }
}

export default NameFinderStory;
