import { Box, LabeledFaceDescriptors } from "face-api.js";

class User {
  id: string;
  createdAt: number;
  lastDetectionAt: number;
  labeledFaceDescriptor: LabeledFaceDescriptors;
  name?: string;
  currentFaceBox: Box;

  constructor(faceDescriptor: Float32Array, faceBox: Box) {
    this.id = crypto.randomUUID();
    this.createdAt = Date.now();
    this.lastDetectionAt = this.createdAt;
    this.labeledFaceDescriptor = new LabeledFaceDescriptors(this.id, [
      faceDescriptor,
    ]);
    this.currentFaceBox = faceBox;
  }

  addFaceDescriptor(faceDescriptor: Float32Array) {
    this.labeledFaceDescriptor.descriptors.push(faceDescriptor);
  }

  handleDetected(faceBox: Box) {
    this.lastDetectionAt = Date.now();
    this.currentFaceBox = faceBox;
  }

  get isNew() {
    return !this.name;
  }
}

export default User;
