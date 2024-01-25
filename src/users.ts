import { Box, LabeledFaceDescriptors } from "face-api.js";
import User from "./user";
import Store from "./store";

class Users {
  private users = new Map<string, User>();
  private store: Store;
  currentUser?: User;

  constructor(store: Store) {
    this.store = store;
  }

  async init() {
    await this.loadFromStore();
  }

  onLogin?: () => void;
  onLogout?: () => void;

  find(userId: string): User | undefined {
    return this.users.get(userId);
  }

  login(userId: string, faceBox: Box) {
    console.log("Login:", userId);

    this.currentUser = this.find(userId);
    if (!this.currentUser) {
      console.error("Wrong userId", userId);
      return;
    }
    this.currentUser.handleLogin(faceBox);

    if (this.onLogin) this.onLogin();
  }

  logout() {
    console.log("Logout:", this.currentUser?.id);

    this.currentUser = undefined;

    if (this.onLogout) this.onLogout();
  }

  create(faceDescriptor: Float32Array, faceBox: Box) {
    console.log("User created");

    const user = new User(this.store, faceDescriptor, faceBox);
    this.users.set(user.id, user);
    this.login(user.id, faceBox);
    this.store.addUser(user);
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
