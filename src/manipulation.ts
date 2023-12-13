// export const maipulate = (canvas: HTMLCanvasElement) => {
//   const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

//   const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//   const buf = new ArrayBuffer(imgData.data.length);
//   // const buf8 = new Uint8ClampedArray(buf);
//   const data = new Uint32Array(buf);

//   let j = 0;
//   for (let i = 0; i < data.length; i += 4) {
//     const grey =
//       0.2126 * imgData.data[i] +
//       0.7152 * imgData.data[i + 1] +
//       0.0722 * imgData.data[i + 2];
//     data[j] =
//       (255 << 24) | // alpha
//       (grey << 16) | // blue
//       (grey << 8) | // green
//       grey; // red
//     j++; // Advance current the increment
//   }
// };

// export const fisheye = (
//   posX: number,
//   posY: number,
//   radius: number,
//   destCanvas: HTMLCanvasElement,
//   sourceCanvas: HTMLCanvasElement
// ) => {
//   const width = sourceCanvas.width;
//   const height = sourceCanvas.height;

//   const destCTX = destCanvas.getContext("2d");
//   if (!destCTX) return;

//   const destImageData = destCTX.getImageData(0, 0, width, height);
//   this.textures[curDestCanvas].data.data.set(
//     new Uint8ClampedArray(this.textures[curSourceCanvas].data.data)
//   );
//   destImageData.data.set(new Uint8ClampedArray());
//   const destData = destImageData.data;
//   const sourceData = sourceCanvasTexture.data.data;
//   const sourceWidth = sourceCanvasTexture.getWidth();
//   const destWidth = destCanvasTexture.getWidth();
//   const halfRadius = 0.5 * radius;

//   const sqrt = Math.sqrt;
//   const cos = Math.cos;
//   const atan2 = Math.atan2;
//   const round = Math.round;
//   const sin = Math.sin;

//   for (let y = 0; y < radius; y++) {
//     let ptr = (posX + (y + posY) * destWidth) * 4;

//     const ny = y / halfRadius - 1.0;
//     const ny2 = ny ** 2;

//     for (let x = 0; x < radius; x++) {
//       const nx = x / halfRadius - 1.0;
//       const r = sqrt(nx ** 2 + ny2);

//       if (r >= 0.0 && r <= 1.0) {
//         const theta = atan2(ny, nx);

//         const rd = (r + (1 - sqrt(1 - r ** 2))) / 2; // rdLookup[round(r * 10000)];

//         if (rd <= 1.0) {
//           const fnx = rd * cos(theta);
//           const fny = rd * sin(theta);
//           const px = posX + round((fnx + 1.0) * halfRadius);
//           const py = posY + round((fny + 1.0) * halfRadius);

//           let bgPtr = (py * sourceWidth + px) * 4;

//           destData[ptr++] = sourceData[bgPtr++];
//           destData[ptr++] = sourceData[bgPtr++];
//           destData[ptr++] = sourceData[bgPtr++];

//           ptr++;
//         } else {
//           ptr += 4;
//         }
//       } else {
//         ptr += 4;
//       }
//     }
//   }
// };
