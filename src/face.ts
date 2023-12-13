import * as faceapi from "face-api.js";

const CANVAS_WIDTH = 250;
const CANVAS_HEIGHT = 250;

export class FaceDetection {
  private video: HTMLVideoElement;
  private detectionOptions: faceapi.TinyFaceDetectorOptions;

  private faceCanvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private lastBoxes: faceapi.Box[] = [];

  private results: faceapi.WithFaceDescriptor<
    faceapi.WithFaceLandmarks<
      {
        detection: faceapi.FaceDetection;
      },
      faceapi.FaceLandmarks68
    >
  >[] = [];

  constructor() {
    this.video = document.getElementById("video") as HTMLVideoElement;
    this.detectionOptions = new faceapi.TinyFaceDetectorOptions();
    this.faceCanvas = document.getElementById(
      "faceCanvas"
    ) as HTMLCanvasElement;
    this.ctx = this.faceCanvas.getContext("2d") as CanvasRenderingContext2D;
  }

  async init() {
    await faceapi.nets.tinyFaceDetector.loadFromUri("models");
    await faceapi.nets.faceLandmark68Net.loadFromUri("models");
    await faceapi.nets.faceRecognitionNet.loadFromUri("models");
  }

  async detect(): Promise<
    | faceapi.WithFaceDescriptor<
        faceapi.WithFaceLandmarks<
          {
            detection: faceapi.FaceDetection;
          },
          faceapi.FaceLandmarks68
        >
      >
    | undefined
  > {
    const detection = await faceapi
      .detectSingleFace(this.video, this.detectionOptions)
      .withFaceLandmarks()
      .withFaceDescriptor();

    // const displaySize = { width: video.videoWidth, height: video.videoHeight };
    // resize the overlay canvas to the input dimensions
    // faceapi.matchDimensions(canvas, displaySize);
    // const resizedDetections = faceapi.resizeResults(detections, displaySize);

    // faceapi.draw.drawDetections(canvas, resizedDetections);

    if (detection) {
      if (this.results.length === 0) this.results.push(detection);

      const faceMatcher = new faceapi.FaceMatcher(this.results);
      const bestMatch = faceMatcher.findBestMatch(detection.descriptor);

      if (bestMatch.toString(false) === "unknown") this.results.push(detection);
      else {
        // console.log(bestMatch.toString(), bestMatch.label, bestMatch.distance);
      }
    }

    return detection;
  }

  draw(faceBox: faceapi.Box) {
    const averageBox = this.calculateAverageBox(faceBox);

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

  private calculateAverageBox(faceBox: faceapi.Box): faceapi.Box {
    this.lastBoxes.push(faceBox);
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

    const newFaceBox = { ...faceBox, ...averageBox } as faceapi.Box;

    return newFaceBox;
  }
}
