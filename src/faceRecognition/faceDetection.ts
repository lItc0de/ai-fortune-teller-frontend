import {
  FaceMatcher,
  TinyFaceDetectorOptions,
  detectSingleFace,
  nets,
} from "face-api.js";
import { WebCamHelper, asyncRequestAnimationFrameMs } from "../utils/helpers";
import Users from "../users";
import User from "../user";
import FaceExtractor from "./faceExtractor";

class FaceDetection {
  private video: HTMLVideoElement;
  private detectionOptions: TinyFaceDetectorOptions;
  private webcamHelper: WebCamHelper;
  private users: Users;
  private detectedUserIds: string[] = [];
  private currentUser?: User;
  private listeners: (() => void)[] = [];
  private faceExtractor: FaceExtractor;

  private started = false;

  constructor(users: Users) {
    this.detectionOptions = new TinyFaceDetectorOptions();
    this.webcamHelper = new WebCamHelper();
    this.video = this.webcamHelper.video;
    this.users = users;
    this.faceExtractor = new FaceExtractor();
  }

  async init() {
    await nets.tinyFaceDetector.loadFromUri("models");
    await nets.faceLandmark68Net.loadFromUri("models");
    await nets.faceRecognitionNet.loadFromUri("models");
  }

  async start() {
    await this.webcamHelper.start();
    this.started = true;
    this.loop();
  }

  async stop() {
    this.started = false;
  }

  subscribe = (listener: () => void) => {
    this.listeners.push(listener);
    this.listeners = [...this.listeners, listener];

    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  };

  getCurrentUser = (): User | undefined => {
    return this.currentUser;
  };

  updateUsername = (name: string) => {
    console.log("loooool new name:", name);

    if (!this.currentUser) return;
    this.currentUser.updateName(name);
    this.emitUserChange();
  };

  private emitUserChange() {
    console.log("emitUserChange", this.currentUser);
    if (!this.currentUser) return;

    this.listeners.forEach((listener) => listener());
  }

  private async detect(): Promise<void> {
    const detection = await detectSingleFace(this.video, this.detectionOptions)
      .withFaceLandmarks()
      .withFaceDescriptor();

    // no detection
    if (!detection) {
      if (
        this.currentUser &&
        Date.now() - this.currentUser.lastDetectionAt >= 5000
      ) {
        this.currentUser = undefined;
        this.emitUserChange();
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

    const averageMatchedUserId = this.getAverageUserId(matchedUserId);

    // handle previous session
    if (this.currentUser) {
      switch (averageMatchedUserId) {
        case this.currentUser.id:
          this.currentUser.handleDetected(faceBox);
          if (averageMatchedUserId !== matchedUserId) {
            this.currentUser.addFaceDescriptor(faceDescriptor);
          }
          break;

        case "undefined":
          if (Date.now() - this.currentUser.lastDetectionAt < 5000) {
            this.currentUser.addFaceDescriptor(faceDescriptor);
            this.currentUser.handleDetected(faceBox);
          } else {
            this.currentUser = undefined;
            this.emitUserChange();
            const newUser = this.users.create(faceDescriptor, faceBox);
            this.currentUser = newUser;
            this.currentUser.handleDetected(faceBox);
            this.emitUserChange();
          }
          break;

        default:
          this.currentUser = undefined;
          this.emitUserChange();
          this.currentUser = this.users.find(averageMatchedUserId);
          if (this.currentUser) {
            this.emitUserChange();
            this.currentUser.handleDetected(faceBox);
          }
          break;
      }

      return;
    }

    if (averageMatchedUserId === "undefined") {
      this.currentUser = this.users.create(faceDescriptor, faceBox);
      if (this.currentUser) {
        this.emitUserChange();
        this.currentUser.handleDetected(faceBox);
      }
      return;
    }

    this.currentUser = this.users.find(averageMatchedUserId);
    if (this.currentUser) {
      this.emitUserChange();
      this.currentUser.handleDetected(faceBox);
    }
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
      if (this.currentUser) this.faceExtractor.draw(this.currentUser);

      await asyncRequestAnimationFrameMs(100);
    } while (this.started);
  }
}

export default FaceDetection;
