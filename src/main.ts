import FaceDetection from "./faceRecognition/faceDetection";
import createReactApp from "./page/main";
import Users from "./users";

class Main {
  private users: Users;
  private faceDetection?: FaceDetection;

  constructor() {
    this.users = new Users();
  }

  async init() {
    await this.users.init();
    this.faceDetection = new FaceDetection(this.users);
    await this.faceDetection.init();

    createReactApp(
      this.faceDetection.subscribe,
      this.faceDetection.getCurrentUser,
      this.faceDetection.updateUsername,
      this.handleStart
    );
  }

  private handleStart = () => {
    this.faceDetection?.start();
  };
}

const main = new Main();
main.init();
