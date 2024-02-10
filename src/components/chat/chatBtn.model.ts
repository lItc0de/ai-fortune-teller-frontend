class ChatBtnModel {
  id: string;
  number: string;
  label: string;
  handleClick?: (number: string) => void;

  constructor(
    number: string,
    label: string,
    handleClick?: (number: string) => void
  ) {
    this.id = crypto.randomUUID();
    this.number = number;
    this.label = label;
    this.handleClick = handleClick;
  }
}

export default ChatBtnModel;
