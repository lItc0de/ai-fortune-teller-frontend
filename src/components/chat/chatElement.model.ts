import { Topic } from "../../utils/serverMessage";

abstract class ChatElementModel {
  id: string;
  isFortuneTeller: boolean;
  timestamp: number;
  done: boolean;
  topic?: Topic;
  handleDone?: (value?: string) => void;

  constructor(
    isFortuneTeller: boolean,
    done = false,
    handleDone?: (value?: string) => void,
    topic?: Topic
  ) {
    this.timestamp = Date.now();
    this.id = crypto.randomUUID();
    this.isFortuneTeller = isFortuneTeller;
    this.handleDone = handleDone;
    this.done = done;
    this.topic = topic;
  }
}

export default ChatElementModel;
