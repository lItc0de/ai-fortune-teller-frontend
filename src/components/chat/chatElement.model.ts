abstract class ChatElementModel {
  id: string;
  isFortuneTeller: boolean;
  timestamp: number;
  done: boolean;
  handleDone?: (value?: string) => void;

  constructor(
    isFortuneTeller: boolean,
    done = false,
    handleDone?: (value?: string) => void
  ) {
    this.timestamp = Date.now();
    this.id = crypto.randomUUID();
    this.isFortuneTeller = isFortuneTeller;
    this.handleDone = handleDone;
    this.done = done;
  }
}

export default ChatElementModel;
