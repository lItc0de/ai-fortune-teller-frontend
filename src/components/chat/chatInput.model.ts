import ChatElementModel from "./chatElement.model";

class ChatInputModel extends ChatElementModel {
  constructor(
    isFortuneTeller: boolean,
    done = false,
    handleDone?: (value?: string) => void
  ) {
    super(isFortuneTeller, done, handleDone);
  }
}

export default ChatInputModel;
