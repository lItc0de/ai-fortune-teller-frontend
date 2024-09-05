import {
  Box,
  FaceMatcher,
  TinyFaceDetectorOptions,
  detectSingleFace,
  nets,
} from "face-api.js";
import { WebCamHelper, asyncRequestAnimationFrameMs } from "../utils/helpers";
import FaceExtractor from "./faceExtractor";
import DetectionUser from "./detectionUser";

const LOGOUT_TIME = 10000;

class FaceDetection {
  private video: HTMLVideoElement;
  private detectionOptions: TinyFaceDetectorOptions;
  private webcamHelper: WebCamHelper;

  private detectionUsers: DetectionUser[] = [];
  private detectionUserId?: string;
  private detectionUser?: DetectionUser;

  private detectedUserIds: string[] = [];
  private listeners: (() => void)[] = [];
  private faceExtractor: FaceExtractor;

  private addDbUser: (dbUser: DetectionUser) => Promise<void>;
  private started = false;

  constructor(
    initialDetectionUsers: DetectionUser[],
    addDbUser: (dbUser: DetectionUser) => Promise<void>
  ) {
    this.detectionUsers = initialDetectionUsers;
    this.detectionOptions = new TinyFaceDetectorOptions();
    this.webcamHelper = new WebCamHelper();
    this.video = this.webcamHelper.video;
    this.faceExtractor = new FaceExtractor();
    this.addDbUser = addDbUser;
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

  detectionIdSubscribe = (listener: () => void) => {
    this.listeners.push(listener);
    this.listeners = [...this.listeners, listener];

    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  };

  getDetectionId = (): string | undefined => {
    return this.detectionUserId;
  };

  private updateDetectionUserId(newDetectionUserId?: string) {
    if (this.detectionUserId === newDetectionUserId) return;

    this.detectionUserId = newDetectionUserId;
    this.detectionUser = this.findDetectionUser(this.detectionUserId);
    this.emitDetectionIdChange();
  }

  private emitDetectionIdChange() {
    this.listeners.forEach((listener) => listener());
  }

  private createDetectionUser(faceDescriptor: Float32Array, faceBox: Box) {
    const newDetectionUser = new DetectionUser({
      faceBox,
      faceDescriptors: [faceDescriptor],
    });
    this.detectionUsers.push(newDetectionUser);
    this.addDbUser(newDetectionUser);
    this.updateDetectionUserId(newDetectionUser.id);
    this.clearDetectedUserIds();
  }

  private findDetectionUser = (
    detectionUserId?: string
  ): DetectionUser | undefined =>
    this.detectionUsers.find(({ id }) => id === detectionUserId);

  private async detect(): Promise<void> {
    const detection = await detectSingleFace(this.video, this.detectionOptions)
      .withFaceLandmarks()
      .withFaceDescriptor();

    // no detection
    if (!detection) {
      if (
        this.detectionUser &&
        Date.now() - this.detectionUser.lastDetectionAt >= LOGOUT_TIME
      ) {
        this.updateDetectionUserId(undefined);
        this.clearDetectedUserIds();
      }
      return;
    }

    const faceDescriptor = detection.descriptor;
    const faceBox = detection.detection.box;

    if (this.detectionUsers.length === 0) {
      this.createDetectionUser(faceDescriptor, faceBox);
    }

    const labeledFaceDescriptors = this.detectionUsers.map(
      ({ labeledFaceDescriptor }) => labeledFaceDescriptor
    );
    const faceMatcher = new FaceMatcher(labeledFaceDescriptors);
    const matchedUserId = faceMatcher
      .findBestMatch(faceDescriptor)
      .toString(false);

    const averageMatchedUserId = this.getAverageUserId(matchedUserId);

    if (!this.detectionUserId || !this.detectionUser) {
      if (averageMatchedUserId === "unknown") {
        this.createDetectionUser(faceDescriptor, faceBox);
      } else {
        this.updateDetectionUserId(averageMatchedUserId);
      }
    } else if (this.detectionUserId === averageMatchedUserId) {
      this.detectionUser.handleDetected(faceBox);
    } else {
      if (this.detectionUser.lastDetectionAt <= LOGOUT_TIME) return;

      if (averageMatchedUserId === "unknown") {
        this.createDetectionUser(faceDescriptor, faceBox);
      } else {
        this.updateDetectionUserId(averageMatchedUserId);
      }
    }
  }

  private clearDetectedUserIds() {
    this.detectedUserIds = [];
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
    }, "unknown");
  }

  private async loop() {
    do {
      await this.detect();
      if (this.detectionUser) this.faceExtractor.draw(this.detectionUser);

      await asyncRequestAnimationFrameMs(100);
    } while (this.started);
  }
}

export default FaceDetection;
