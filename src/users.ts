import { Box, LabeledFaceDescriptors } from "face-api.js";
import User from "./user";
import Store from "./store";

class Users {
  private users = new Map<string, User>();
  private store: Store;

  constructor() {
    this.store = new Store();
  }

  async init() {
    await this.store.init();
    await this.loadFromStore();
  }

  find(userId?: string): User | undefined {
    if (!userId) return;
    return this.users.get(userId);
  }

  create(faceDescriptor: Float32Array, faceBox: Box): User {
    const user = new User(this.store, faceDescriptor, faceBox);
    this.users.set(user.id, user);
    this.store.addUser(user);
    return user;
  }

  get length(): number {
    return this.users.size;
  }

  get labeledFaceDescriptors(): LabeledFaceDescriptors[] {
    return Array.from(this.users.values()).map(
      ({ labeledFaceDescriptor }) => labeledFaceDescriptor
    );
  }

  private async loadFromStore() {
    const users = await this.store.getUsers();
    users.forEach((user) => {
      this.users.set(user.id, user);
    });
  }
}

export default Users;
