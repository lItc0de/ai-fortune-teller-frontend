import { Box, LabeledFaceDescriptors } from "face-api.js";
import User from "./user";

class Users {
  private users = new Map<string, User>();
  currentUser?: User;

  find(userId: string): User | undefined {
    return this.users.get(userId);
  }

  login(userId: string) {
    this.currentUser = this.find(userId);

    // TODO: create login callback
  }

  create(faceDescriptor: Float32Array, faceBox: Box) {
    const user = new User(faceDescriptor, faceBox);
    this.users.set(user.id, user);

    this.login(user.id);
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
