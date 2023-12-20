import * as faceapi from "face-api.js";
import FaceDescriptors from "./faceDescriptors";
import { sleepMs } from "../helpers";

const CANVAS_WIDTH = 250;
const CANVAS_HEIGHT = 250;

class FaceDetection {
  private video: HTMLVideoElement;
  private detectionOptions: faceapi.TinyFaceDetectorOptions;

  private faceCanvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private lastBoxes: faceapi.Box[] = [];
  private faceDescriptors: FaceDescriptors;
  private started = false;
  private lastDetectionIds: string[] = [];
  private currentDetectionId: string = "undefined";
  private newUserCallback: (userId: string) => void;

  constructor(newUserCallback: (userId: string) => void) {
    this.video = document.getElementById("video") as HTMLVideoElement;
    this.detectionOptions = new faceapi.TinyFaceDetectorOptions();
    this.faceCanvas = document.getElementById(
      "faceCanvas"
    ) as HTMLCanvasElement;
    this.ctx = this.faceCanvas.getContext("2d") as CanvasRenderingContext2D;
    this.faceDescriptors = new FaceDescriptors();
    this.newUserCallback = newUserCallback;
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

  draw() {
    const averageBox = this.calculateAverageBox();

    this.faceCanvas.width = CANVAS_WIDTH;
    this.faceCanvas.height = CANVAS_HEIGHT;
    const offsetY = averageBox.height / 2;
    const offsetX = 50;

    const scaleX = (CANVAS_WIDTH - offsetX) / averageBox.width;
    const scaleY = CANVAS_HEIGHT / averageBox.height - 0.4;

    const translateX = offsetX / 2 - averageBox.x * scaleX;
    const translateY = offsetY - averageBox.y * scaleY;

    this.ctx.translate(translateX, translateY);
    this.ctx.scale(scaleX, scaleY);
    this.ctx.drawImage(
      this.video,
      0,
      0,
      this.video.videoWidth,
      this.video.videoHeight
    );
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

    this.lastBoxes.push(detection.detection.box);
  }

  private getAverageId(): string {
    if (this.currentDetectionId === "undefined") {
      if (this.lastDetectionIds.length < 100) return "undefined";
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
        this.newUserCallback(this.currentDetectionId);
      }

      await sleepMs(100);
    } while (this.started);
  }

  private calculateAverageBox(): faceapi.Box {
    const sumBox = this.lastBoxes.reduce(
      (prev, curr) => {
        return {
          x: prev.x + curr.x,
          y: prev.y + curr.y,
          width: prev.width + curr.width,
          height: prev.height + curr.height,
        };
      },
      { x: 0, y: 0, width: 0, height: 0 }
    );

    const averageBox = {
      x: sumBox.x / this.lastBoxes.length,
      y: sumBox.y / this.lastBoxes.length,
      width: sumBox.width / this.lastBoxes.length,
      height: sumBox.height / this.lastBoxes.length,
    };

    this.lastBoxes = this.lastBoxes.slice(-3);

    const newFaceBox = averageBox as faceapi.Box;

    return newFaceBox;
  }
}

export default FaceDetection;
