import * as faceapi from "face-api.js";

class FaceDescriptor {
  labeledDescriptor: faceapi.LabeledFaceDescriptors;
  name: string | undefined;

  constructor(descriptor: Float32Array) {
    const label = crypto.randomUUID();
    this.labeledDescriptor = new faceapi.LabeledFaceDescriptors(label, [
      descriptor,
    ]);
  }

  get id(): string {
    return this.labeledDescriptor.label;
  }
}

export default FaceDescriptor;
