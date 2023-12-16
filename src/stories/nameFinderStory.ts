import User from "../utils/user";
import InOutHelper from "../utils/inOutHelper";
import BaseStory from "./baseStory";
import StoryState, { StoryIds } from "../utils/storyState";

class NameFinderStory extends BaseStory {
  constructor(user: User, botUser: User, inOutHelper: InOutHelper) {
    super(user, botUser, inOutHelper);
  }

  async *tell() {
    await this.inOutHelper.writeWithSynthesis(
      "Hello there, nice too meet you! Before we begin, can you please tell me your name?",
      this.botUser
    );
    yield new StoryState(StoryIds.NAME_FINDING);

    let name;
    let findName = true;
    while (findName) {
      let askForName = true;
      while (askForName) {
        name = (await this.inOutHelper.waitForUserInput())
          .trim()
          .replace(".", "");
        yield new StoryState(StoryIds.NAME_FINDING);

        if (this.countWords(name) !== 1) {
          await this.inOutHelper.writeWithSynthesis(
            "Sorry, but I didn't understand this, pleas just tell me your name in one word.",
            this.botUser
          );
        } else {
          askForName = false;
        }
        yield new StoryState(StoryIds.NAME_FINDING);
      }

      await this.inOutHelper.writeWithSynthesis(
        `So your name is ${name}? Can you please confirm.`,
        this.botUser
      );

      yield new StoryState(StoryIds.NAME_FINDING);

      let checkIfName = true;
      while (checkIfName) {
        const answer = (await this.inOutHelper.waitForUserInput())
          .trim()
          .toLowerCase()
          .replace(".", "");

        yield new StoryState(StoryIds.NAME_FINDING);

        if (answer === "no") {
          await this.inOutHelper.writeWithSynthesis(
            "Sorry, please tell me your name again.",
            this.botUser
          );
          checkIfName = false;
          yield new StoryState(StoryIds.NAME_FINDING);
        } else if (answer === "yes") {
          checkIfName = false;
          findName = false;
          yield new StoryState(StoryIds.NAME_FINDING);
        } else {
          await this.inOutHelper.writeWithSynthesis(
            "Sorry, I couldn't understand your answer. Pleas just say yes or no",
            this.botUser
          );
          yield new StoryState(StoryIds.NAME_FINDING);
        }
      }
    }

    await this.inOutHelper.writeWithSynthesis(
      `Hello ${name}, nice to meet you.`,
      this.botUser
    );

    console.log({ name });

    this.user.name = name;
    yield new StoryState(StoryIds.NAME_FINDING, name, true);
  }

  // async findName(): Promise<string> {
  //   await this.inOutHelper.writeWithSynthesis(
  //     "Hello there, nice too meet you! Before we begin, can you please tell me your name?",
  //     this.botUser
  //   );

  //   const name = await this.waitForName();

  //   return name;
  // }

  // private async waitForName(): Promise<string> {
  //   const name = (await this.inOutHelper.waitForUserInput())
  //     .trim()
  //     .replace(".", "");

  //   if (this.countWords(name) !== 1) {
  //     await this.inOutHelper.writeWithSynthesis(
  //       "Sorry, but I didn't understand this, pleas just tell me your name in one word.",
  //       this.botUser
  //     );
  //     return await this.waitForName();
  //   }

  //   await this.inOutHelper.writeWithSynthesis(
  //     `So your name is ${name}? Can you please confirm.`,
  //     this.botUser
  //   );

  //   const confirmedName = await this.waitForConfirmation(name);

  //   await this.inOutHelper.writeWithSynthesis(
  //     `Hello ${name}, nice to meet you.`,
  //     this.botUser
  //   );

  //   return confirmedName;
  // }

  // private async waitForConfirmation(name: string): Promise<string> {
  //   const answer = (await this.inOutHelper.waitForUserInput())
  //     .trim()
  //     .toLowerCase()
  //     .replace(".", "");

  //   if (answer === "no") {
  //     await this.inOutHelper.writeWithSynthesis(
  //       "Sorry, please tell me your name again.",
  //       this.botUser
  //     );
  //     return await this.waitForName();
  //   }

  //   if (answer === "yes") {
  //     return name;
  //   }

  //   await this.inOutHelper.writeWithSynthesis(
  //     "Sorry, I couldn't understand your answer. Pleas just say yes or no",
  //     this.botUser
  //   );

  //   return await this.waitForConfirmation(name);
  // }

  private countWords(str: string) {
    return str.trim().split(/\s+/).length;
  }
}

export default NameFinderStory;
