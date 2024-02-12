import FaceDetection from "./faceRecognition/faceDetection";
import createReactApp from "./page/main";
import Store from "./store";

class Main {
  private faceDetection?: FaceDetection;
  private store: Store;

  constructor() {
    this.store = new Store();
  }

  async init() {
    await this.store.init();

    const initialUsers = await this.store.getUsers();
    const initialDetectionUsers = await this.store.getDetectionUsers();

    this.faceDetection = new FaceDetection(
      initialDetectionUsers,
      this.store.addUser
    );
    await this.faceDetection.init();

    createReactApp(
      this.faceDetection.detectionIdSubscribe,
      this.faceDetection.getDetectionId,
      this.handleStart,
      initialUsers,
      this.store.updateUser
    );
  }

  private handleStart = () => {
    this.faceDetection?.start();
  };
}

const main = new Main();
main.init();
