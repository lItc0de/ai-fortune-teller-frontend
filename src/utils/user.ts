export enum UserType {
  BOT,
  PERSON,
}

class User {
  id: string;
  type: UserType;
  name?: string;
  lastVisits: number[] = [];

  constructor(id: string, type: UserType) {
    this.id = id;
    this.type = type;
    this.lastVisits.push(Date.now());
  }
}

export default User;
