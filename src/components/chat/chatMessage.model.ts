import { Topic } from "../../utils/serverMessage";
import ChatElementModel from "./chatElement.model";

class ChatMessageModel extends ChatElementModel {
  text: string;
  awaitsEnter: boolean;

  constructor(
    isFortuneTeller: boolean,
    text: string,
    done = false,
    handleDone?: (value?: string) => void,
    awaitsEnter = false,
    topic?: Topic
  ) {
    super(isFortuneTeller, done, handleDone, topic);
    this.text = text;
    this.awaitsEnter = awaitsEnter;
  }
}

export default ChatMessageModel;
