export enum Topic {
  LOVE,
  CAREER,
  GENERAL,
  QUESTION,
}

export enum Role {
  user,
  system,
  assistant,
}

export type ServerMessageParams = Omit<
  ServerMessage,
  "toJSONString" | "toPrompt" | "toMessage"
>;

class ServerMessage {
  userId: string;
  role: Role;
  content: string;
  topic: Topic;
  userName?: string;

  constructor(params: ServerMessageParams) {
    this.userId = params.userId;
    this.role = params.role;
    this.content = params.content;
    this.topic = params.topic;
    this.userName = params.userName;
  }

  toJSONString(): string {
    return JSON.stringify({
      userId: this.userId,
      role: this.role,
      content: this.content,
      topic: this.topic,
      userName: this.userName,
    });
  }
}

export default ServerMessage;
