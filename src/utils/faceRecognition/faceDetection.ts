import {
  Box,
  FaceMatcher,
  TinyFaceDetectorOptions,
  detectSingleFace,
  nets,
} from "face-api.js";
import { WebCamHelper, asyncRequestAnimationFrameMs } from "../helpers";
import Users from "../../users";
import User from "../../user";

class FaceDetection {
  private video: HTMLVideoElement;
  private detectionOptions: TinyFaceDetectorOptions;
  private webcamHelper: WebCamHelper;
  private started = false;

  private currentDetectionId: string = "undefined";
  private users: Users;

  onDetect?: (faceBox: Box) => void;
  onUser?: (userId: string) => void;

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
      // TODO:
      return;
    }

    // if (this.onDetect) this.onDetect(detection.detection.box);

    const faceDescriptor = detection.descriptor;
    const faceBox = detection.detection.box;

    if (this.users.length === 0) {
      this.users.create(faceDescriptor, faceBox);
    }

    const faceMatcher = new FaceMatcher(this.users.labeledFaceDescriptors);
    const bestMatch = faceMatcher.findBestMatch(faceDescriptor);

    if (this.users.currentUser) {
      if (bestMatch.toString(false) === "unknown") {
        if (this.users.currentUser.lastDetectionAt - Date.now() < 5000) {
          this.users.currentUser.addFaceDescriptor(faceDescriptor);
          this.users.currentUser.handleDetected(faceBox);
        } else {
          this.users.create(faceDescriptor, faceBox);
        }
      } else {
        this.users.currentUser.handleDetected(faceBox);
      }
    } else {
      if (bestMatch.toString(false) === "unknown") {
        this.users.create(faceDescriptor, faceBox);
      } else {
        this.users.login(bestMatch.toString(false));
        if (!this.users.currentUser) {
          this.users.create(faceDescriptor, faceBox);
        } else {
          this.users.currentUser.handleDetected(faceBox);
        }
      }
    }
  }

  private getAverageId(): string {
    if (this.currentDetectionId === "undefined") {
      if (this.lastDetectionIds.length < 30) return "undefined";
      this.lastDetectionIds = this.lastDetectionIds.slice(-100);
    } else {
      if (this.lastDetectionIds.length < 600) return this.currentDetectionId;
      this.lastDetectionIds = this.lastDetectionIds.slice(-600);
    }

    const weightedIds = this.lastDetectionIds.reduce(
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

      const averageDetectionId = this.getAverageId();
      if (this.currentDetectionId !== averageDetectionId) {
        this.currentDetectionId = averageDetectionId;
        // if (this.onUser) this.onUser(averageDetectionId);
      }

      await asyncRequestAnimationFrameMs(100);
    } while (this.started);
  }
}

export default FaceDetection;
