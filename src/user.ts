import { Box, LabeledFaceDescriptors } from "face-api.js";
import Store, { DBUser } from "./store";

class User {
  private store: Store;
  id: string;
  createdAt: number;
  lastLoginAt: number;
  lastDetectionAt: number;
  labeledFaceDescriptor: LabeledFaceDescriptors;
  lastFaceBoxes: Box[] = [];
  image?: Blob;
  profileQuestionsSelection: string[] = [];
  name?: string;

  constructor(
    store: Store,
    faceDescriptor: Float32Array,
    faceBox?: Box,
    id?: string,
    createdAt?: number,
    lastDetectionAt?: number,
    lastLoginAt?: number,
    name?: string,
    image?: Blob,
    profileQuestionsSelection?: string[]
  ) {
    this.id = id || crypto.randomUUID();
    this.createdAt = createdAt || Date.now();
    this.lastDetectionAt = lastDetectionAt || this.createdAt;
    this.lastLoginAt = lastLoginAt || this.createdAt;
    this.labeledFaceDescriptor = new LabeledFaceDescriptors(this.id, [
      faceDescriptor,
    ]);
    this.store = store;
    if (faceBox) this.addFaceBox(faceBox);
    if (name) this.name = name;
    if (image) this.image = image;
    if (profileQuestionsSelection)
      this.profileQuestionsSelection = profileQuestionsSelection;
  }

  async addFaceDescriptor(faceDescriptor: Float32Array) {
    console.debug("add desctiptor");

    this.labeledFaceDescriptor.descriptors.push(faceDescriptor);
    // TODO: Check if needed
    await this.store.updateUser(this.id, {
      faceDescriptors: this.labeledFaceDescriptor.descriptors,
    });
  }

  async handleDetected(faceBox: Box) {
    this.lastDetectionAt = Date.now();
    this.addFaceBox(faceBox);
    await this.store.updateUser(this.id, {
      lastDetectionAt: this.lastDetectionAt,
    });
  }

  async handleLogin(faceBox: Box) {
    this.lastLoginAt = Date.now();
    await this.handleDetected(faceBox);
    await this.store.updateUser(this.id, { lastLoginAt: this.lastLoginAt });
  }

  private addFaceBox(faceBox: Box) {
    this.lastFaceBoxes.push(faceBox);
    this.lastFaceBoxes = this.lastFaceBoxes.slice(-3);
  }

  get isNew() {
    return !this.name;
  }

  updateName(newName: string) {
    this.name = newName;
    this.store.updateUser(this.id, { name: newName });
  }

  updateImage(newImage: Blob) {
    this.image = newImage;
    this.store.updateUser(this.id, { image: newImage });
  }

  updateProfileQuestionsSelection(selection: string[]) {
    this.profileQuestionsSelection = selection;
    this.store.updateUser(this.id, { profileQuestionsSelection: selection });
  }

  static async fromDBUser(store: Store, dbUser: DBUser): Promise<User> {
    const [firstFaceDescriptor, ...faceDescriptors] = dbUser.faceDescriptors;
    const user = new User(
      store,
      firstFaceDescriptor,
      undefined,
      dbUser.id,
      dbUser.createdAt,
      dbUser.lastDetectionAt,
      dbUser.lastDetectionAt,
      dbUser.name,
      dbUser.image,
      dbUser.profileQuestionsSelection
    );
    for (let i = 0; i < faceDescriptors.length; i++) {
      await user.addFaceDescriptor(faceDescriptors[i]);
    }

    return user;
  }
}

export default User;
