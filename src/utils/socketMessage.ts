export enum SocketMessageType {
  BOT,
  PROMPT,
  NEW_SESSION,
  OLD_SESSION,
  USERNAME,
  ABORT,
}

export interface RawSocketMessage {
  type: SocketMessageType;
  prompt?: string;
  userName?: string;
}

class SocketMessage {
  type: SocketMessageType;
  prompt?: string;
  userName?: string;

  constructor(type: SocketMessageType, prompt?: string, userName?: string) {
    this.type = type;
    this.prompt = prompt;
    this.userName = userName;
  }

  toJSON(): string {
    const rawMessage: RawSocketMessage = {
      type: this.type,
      prompt: this.prompt,
      userName: this.userName,
    };
    return JSON.stringify(rawMessage);
  }

  static createfromJSON(json: string) {
    const { type, prompt, userName } = JSON.parse(json) as RawSocketMessage;
    return new SocketMessage(type, prompt, userName);
  }
}

export default SocketMessage;
