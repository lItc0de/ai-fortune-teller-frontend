import { Box, LabeledFaceDescriptors } from "face-api.js";
import User from "./user";

class Users {
  private users = new Map<string, User>();
  currentUser?: User;

  onLogin?: () => void;
  onLogout?: () => void;

  find(userId: string): User | undefined {
    return this.users.get(userId);
  }

  login(userId: string, faceBox: Box) {
    console.log("Login:", userId);

    this.currentUser = this.find(userId);
    if (!this.currentUser) {
      console.error("Wrong userId");
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

    const user = new User(faceDescriptor, faceBox);
    this.users.set(user.id, user);
    this.login(user.id, faceBox);
  }

  get length(): number {
    return this.users.size;
  }

  get labeledFaceDescriptors(): LabeledFaceDescriptors[] {
    return Array.from(this.users.values()).map(
      ({ labeledFaceDescriptor }) => labeledFaceDescriptor
    );
  }
}

export default Users;
