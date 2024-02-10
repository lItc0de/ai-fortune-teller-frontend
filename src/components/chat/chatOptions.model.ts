import ChatElementModel from "./chatElement.model";

export type ChatOption = {
  id: string;
  text?: string;
  imgSrc?: string;
};

class ChatOptionsModel extends ChatElementModel {
  options: ChatOption[];
  label: string;

  constructor(
    isFortuneTeller: boolean,
    label: string,
    options: ChatOption[],
    done = false,
    handleDone?: (value?: string) => void
  ) {
    super(isFortuneTeller, done, handleDone);
    this.label = label;
    this.options = options;
  }
}

export default ChatOptionsModel;
