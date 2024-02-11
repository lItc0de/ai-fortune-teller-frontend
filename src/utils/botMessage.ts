export enum BotMessageType {
  BOT,
  PROMPT,
  NEW_SESSION,
  OLD_SESSION,
  USERNAME,
  ABORT,
  END_SESSION,
}

export interface RawBotMessage {
  type: BotMessageType;
  prompt?: string;
  userName?: string;
}

class BotMessage {
  type: BotMessageType;
  prompt?: string;
  userName?: string;

  constructor(type: BotMessageType, prompt?: string, userName?: string) {
    this.type = type;
    this.prompt = prompt;
    this.userName = userName;
  }

  toJSONString(): string {
    const rawMessage: RawBotMessage = {
      type: this.type,
      prompt: this.prompt,
      userName: this.userName,
    };
    return JSON.stringify(rawMessage);
  }

  static createfromJSON(json: string) {
    const { type, prompt, userName } = JSON.parse(json) as RawBotMessage;
    return new BotMessage(type, prompt, userName);
  }
}

export default BotMessage;
