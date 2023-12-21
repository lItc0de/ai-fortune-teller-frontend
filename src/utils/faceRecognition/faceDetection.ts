import * as faceapi from "face-api.js";
import FaceDescriptors from "./faceDescriptors";
import { asyncRequestAnimationFrameMs } from "../helpers";

class FaceDetection {
  private video: HTMLVideoElement;
  private detectionOptions: faceapi.TinyFaceDetectorOptions;

  private faceDescriptors: FaceDescriptors;
  private started = false;
  private lastDetectionIds: string[] = [];
  private currentDetectionId: string = "undefined";

  onDetect?: (faceBox: faceapi.Box) => void;
  onUser?: (userId: string) => void;

  constructor() {
    this.video = document.getElementById("video") as HTMLVideoElement;
    this.detectionOptions = new faceapi.TinyFaceDetectorOptions();
    this.faceDescriptors = new FaceDescriptors();
  }

  async init() {
    await faceapi.nets.tinyFaceDetector.loadFromUri("models");
    await faceapi.nets.faceLandmark68Net.loadFromUri("models");
    await faceapi.nets.faceRecognitionNet.loadFromUri("models");

    this.start();
  }

  async start() {
    this.started = true;
    this.loop();
  }

  async stop() {
    this.started = false;
  }

  private async detect() {
    const detection = await faceapi
      .detectSingleFace(this.video, this.detectionOptions)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      this.lastDetectionIds.push("undefined");
      return;
    }

    if (this.faceDescriptors.length === 0)
      this.faceDescriptors.add(detection.descriptor);

    const faceMatcher = new faceapi.FaceMatcher(
      this.faceDescriptors.desctiptors
    );
    const bestMatch = faceMatcher.findBestMatch(detection.descriptor);

    if (bestMatch.toString(false) === "unknown") {
      this.lastDetectionIds.push(
        this.faceDescriptors.add(detection.descriptor)
      );
    } else {
      this.lastDetectionIds.push(bestMatch.label);
    }

    if (this.onDetect) this.onDetect(detection.detection.box);
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
      this.detect();
      const detectionId = this.getAverageId();
      if (this.currentDetectionId !== detectionId) {
        this.currentDetectionId = detectionId;
        if (this.onUser) this.onUser(detectionId);
      }

      await asyncRequestAnimationFrameMs(100);
    } while (this.started);
  }
}

export default FaceDetection;
