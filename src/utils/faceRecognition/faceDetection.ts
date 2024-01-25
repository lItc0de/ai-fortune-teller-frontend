import {
  FaceMatcher,
  TinyFaceDetectorOptions,
  detectSingleFace,
  nets,
} from "face-api.js";
import { WebCamHelper, asyncRequestAnimationFrameMs } from "../helpers";
import Users from "../../users";

class FaceDetection {
  private video: HTMLVideoElement;
  private detectionOptions: TinyFaceDetectorOptions;
  private webcamHelper: WebCamHelper;
  private users: Users;
  private detectedUserIds: string[] = [];
  private started = false;

  constructor(users: Users) {
    this.detectionOptions = new TinyFaceDetectorOptions();
    this.webcamHelper = new WebCamHelper();
    this.video = this.webcamHelper.video;
    this.users = users;
  }

  async init() {
    await nets.tinyFaceDetector.loadFromUri("models");
    await nets.faceLandmark68Net.loadFromUri("models");
    await nets.faceRecognitionNet.loadFromUri("models");
    await this.webcamHelper.start();

    this.start();
  }

  async start() {
    this.started = true;
    this.loop();
  }

  async stop() {
    this.started = false;
  }

  private async detect(): Promise<void> {
    const detection = await detectSingleFace(this.video, this.detectionOptions)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      // console.log("No detection");

      if (
        this.users.currentUser &&
        Date.now() - this.users.currentUser.lastDetectionAt >= 5000
      ) {
        this.users.logout();
      }
      return;
    }

    const faceDescriptor = detection.descriptor;
    const faceBox = detection.detection.box;

    if (this.users.length === 0) {
      this.users.create(faceDescriptor, faceBox);
    }

    const faceMatcher = new FaceMatcher(this.users.labeledFaceDescriptors);
    const matchedUserId = faceMatcher
      .findBestMatch(faceDescriptor)
      .toString(false);

    // console.log("Matched id:", matchedUserId);

    const averageMatchedUserId = this.getAverageUserId(matchedUserId);

    // handle previous session
    if (this.users.currentUser) {
      switch (averageMatchedUserId) {
        case this.users.currentUser.id:
          this.users.currentUser.handleDetected(faceBox);
          if (averageMatchedUserId !== matchedUserId) {
            this.users.currentUser.addFaceDescriptor(faceDescriptor);
          }
          break;

        case "undefined":
          if (Date.now() - this.users.currentUser.lastDetectionAt < 5000) {
            this.users.currentUser.addFaceDescriptor(faceDescriptor);
            this.users.currentUser.handleDetected(faceBox);
          } else {
            this.users.logout();
            this.users.create(faceDescriptor, faceBox);
          }
          break;

        default:
          this.users.logout();
          this.users.login(averageMatchedUserId, faceBox);
          break;
      }

      return;
    }

    if (averageMatchedUserId === "undefined") {
      this.users.create(faceDescriptor, faceBox);
      return;
    }

    this.users.login(averageMatchedUserId, faceBox);
  }

  private getAverageUserId(matchedUserId: string): string {
    this.detectedUserIds.push(matchedUserId);
    this.detectedUserIds = this.detectedUserIds.slice(-30);

    const weightedIds = this.detectedUserIds.reduce(
      (map: { [key: string]: number }, val) => {
        map[val] = (Number(map[val]) || 0) + 1;
        return map;
      },
      {}
    );

    return Object.keys(weightedIds).reduce((prev, curr) => {
      return weightedIds[curr] > (weightedIds[prev] || 0) ? curr : prev;
    }, "undefined");
  }

  private async loop() {
    do {
      await this.detect();

      await asyncRequestAnimationFrameMs(100);
    } while (this.started);
  }
}

export default FaceDetection;
