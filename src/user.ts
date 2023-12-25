import { Box, LabeledFaceDescriptors } from "face-api.js";

class User {
  id: string;
  createdAt: number;
  lastLoginAt: number;
  lastDetectionAt: number;
  labeledFaceDescriptor: LabeledFaceDescriptors;
  name?: string;
  lastFaceBoxes: Box[] = [];

  constructor(faceDescriptor: Float32Array, faceBox: Box) {
    this.id = crypto.randomUUID();
    this.createdAt = Date.now();
    this.lastDetectionAt = this.createdAt;
    this.lastLoginAt = this.createdAt;
    this.labeledFaceDescriptor = new LabeledFaceDescriptors(this.id, [
      faceDescriptor,
    ]);
    this.addFaceBox(faceBox);
  }

  addFaceDescriptor(faceDescriptor: Float32Array) {
    console.log("add desctiptor");

    this.labeledFaceDescriptor.descriptors.push(faceDescriptor);
  }

  handleDetected(faceBox: Box) {
    this.lastDetectionAt = Date.now();
    this.addFaceBox(faceBox);
  }

  handleLogin(faceBox: Box) {
    this.lastLoginAt = Date.now();
    this.handleDetected(faceBox);
  }

  private addFaceBox(faceBox: Box) {
    this.lastFaceBoxes.push(faceBox);
    this.lastFaceBoxes = this.lastFaceBoxes.slice(-3);
  }

  get isNew() {
    return !this.name;
  }
}

export default User;
