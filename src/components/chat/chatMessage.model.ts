import ChatElementModel from "./chatElement.model";

class ChatMessageModel extends ChatElementModel {
  text: string;

  constructor(
    isFortuneTeller: boolean,
    text: string,
    done = false,
    handleDone?: (value: string) => void
  ) {
    super(isFortuneTeller, done, handleDone);
    this.text = text;
  }
}

export default ChatMessageModel;
