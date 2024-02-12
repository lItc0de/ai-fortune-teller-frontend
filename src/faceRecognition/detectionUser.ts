import { Box, LabeledFaceDescriptors } from "face-api.js";
import UserCreateError from "../errors/userCreateError";

type DetectionUserParams = Partial<
  Omit<DetectionUser, "lastFaceBoxes" | "labeledFaceDescriptor">
> & {
  faceBox?: Box;
  faceDescriptors: Float32Array[];
};

class DetectionUser {
  id: string;
  lastDetectionAt: number;
  labeledFaceDescriptor: LabeledFaceDescriptors;
  lastFaceBoxes: Box[] = [];

  constructor(params: DetectionUserParams) {
    if (!params.faceDescriptors) throw new UserCreateError();

    this.id = params?.id || crypto.randomUUID();
    this.lastDetectionAt = params?.lastDetectionAt || Date.now();
    this.labeledFaceDescriptor = new LabeledFaceDescriptors(
      this.id,
      params.faceDescriptors
    );
    if (params.faceBox) this.addFaceBox(params.faceBox);
  }

  // async addFaceDescriptor(faceDescriptor: Float32Array) {
  //   if (this.labeledFaceDescriptor.descriptors.length >= 10) return;

  //   this.labeledFaceDescriptor.descriptors.push(faceDescriptor);
  //   await this.store.updateUser(this.id, {
  //     faceDescriptors: this.labeledFaceDescriptor.descriptors,
  //   });
  // }

  handleDetected(faceBox: Box) {
    this.lastDetectionAt = Date.now();
    this.addFaceBox(faceBox);
    // await this.store.updateUser(this.id, {
    //   lastDetectionAt: this.lastDetectionAt,
    // });
  }

  private addFaceBox(faceBox: Box) {
    this.lastFaceBoxes.push(faceBox);
    this.lastFaceBoxes = this.lastFaceBoxes.slice(-3);
  }
}

export default DetectionUser;
