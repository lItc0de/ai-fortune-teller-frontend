import FaceDetection from "./faceRecognition/faceDetection";
import createReactApp from "./page/main";

class Main {
  private faceDetection?: FaceDetection;

  async init() {
    this.faceDetection = new FaceDetection();
    await this.faceDetection.init();

    createReactApp(
      this.faceDetection.detectionIdSubscribe,
      this.faceDetection.getDetectionId,
      this.handleStart
    );
  }

  private handleStart = () => {
    this.faceDetection?.start();
  };
}

const main = new Main();
main.init();
