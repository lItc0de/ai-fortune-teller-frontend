import { type LabeledFaceDescriptors } from "face-api.js";
import FaceDescriptor from "./faceDescriptor";

class FaceDescriptors {
  faceDescriptors: FaceDescriptor[] = [];

  add(descriptor: Float32Array): string {
    const newDescriptor = new FaceDescriptor(descriptor);
    this.faceDescriptors.push(newDescriptor);

    return newDescriptor.id;
  }

  get length() {
    return this.faceDescriptors.length;
  }

  get desctiptors(): LabeledFaceDescriptors[] {
    return this.faceDescriptors.map(
      ({ labeledDescriptor }) => labeledDescriptor
    );
  }
}

export default FaceDescriptors;
