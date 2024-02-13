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

  constructor(params: ServerMessageParams) {
    this.userId = params.userId;
    this.role = params.role;
    this.content = params.content;
    this.topic = params.topic;
  }

  toJSONString(): string {
    return JSON.stringify({
      userId: this.userId,
      role: this.role,
      content: this.content,
      topic: this.topic,
    });
  }
}

export default ServerMessage;
