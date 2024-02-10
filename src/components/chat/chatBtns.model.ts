import ChatBtnModel from "./chatBtn.model";
import ChatElementModel from "./chatElement.model";

class ChatBtnsModel extends ChatElementModel {
  btns: ChatBtnModel[];

  constructor(
    isFortuneTeller: boolean,
    buttonLables: string[],
    done = false,
    handleDone?: (value?: string) => void
  ) {
    super(isFortuneTeller, done, handleDone);
    this.btns = buttonLables.map(
      (label, i) => new ChatBtnModel(i.toString(), label, handleDone)
    );
  }
}

export default ChatBtnsModel;
