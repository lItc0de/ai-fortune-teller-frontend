import ChatElementModel from "./chatElement.model";

class ChatMessageModel extends ChatElementModel {
  text: string;
  awaitsEnter: boolean;

  constructor(
    isFortuneTeller: boolean,
    text: string,
    done = false,
    handleDone?: (value?: string) => void,
    awaitsEnter = false
  ) {
    super(isFortuneTeller, done, handleDone);
    this.text = text;
    this.awaitsEnter = awaitsEnter;
  }
}

export default ChatMessageModel;
