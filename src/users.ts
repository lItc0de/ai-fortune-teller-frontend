import User from "./user";

class Users {
  private users: User[] = [];

  find(userId: string): User | undefined {
    return this.users.find((user) => user.id === userId);
  }

  create(userId: string): User {
    const oldUser = this.find(userId);
    if (oldUser) return oldUser;

    const user = new User(userId, "person");
    this.users.push(user);

    return user;
  }
}

export default Users;
