function mean(width: number, height: number, buffer: Array<Uint8Array>, matrixSize: number) {
  let rowSumsCol = new Array(height);
  for (let y = 0; y < height; y++) {
    let rowSums = new Array(width).fill(0);
    for (let x = 0; x < matrixSize; x++) {
      rowSums[0] += buffer[y][x];
    }
    for (let xEnd = matrixSize; xEnd < width; xEnd++) {
      let xStart = xEnd - matrixSize + 1;
      rowSums[xStart] = rowSums[xStart - 1] + buffer[y][xEnd] - buffer[y][xStart - 1];
    }
    rowSumsCol[y] = rowSums;
  }

  let mWidth = width - matrixSize + 1;
  let mHeight = height - matrixSize + 1;
  const mean = new Array(mHeight);
  for (let h = 0; h < mHeight; h++) {
    mean[h] = new Uint8Array(width).fill(0);
  }

  for (let x = 0; x < mWidth; x++) {
    for (let y = 0; y < matrixSize; y++) {
      const prev = mean[0][x];
      mean[0][x] = prev + rowSumsCol[y][x];
    }
  }
  for (let x = 0; x < mWidth; x++) {
    for (let y = 1; y < mHeight; y++) {
      mean[y][x] = mean[y-1][x] - rowSumsCol[y-1][x] + rowSumsCol[y+matrixSize-1][x];
    }
  }

  // Devide
  // for (let x = 0; x < mWidth; x++) {
  //   for (let y = 0; y < mHeight; y++) {
  //     mean[y][x] = mean[y][x] / (matrixSize * matrixSize);
  //   }
  // }
  return mean;
}
// function mean(width: number, height: number, buffer: ArrayBuffer, matrixSize: number) {
//   // I like Shakutori method!
//   let rowSumsCol = new Array(height)
//   for (let y = 0; y < height; y++) {
//     let rowSums = new Array(width).fill(0);
//     for (let x = 0; x < matrixSize; x++) {
//       //rowSums[0] += pixels.get(x, y);
//       rowSums[0] += buffer[y*height+x];
//     }
//     for (let xEnd = matrixSize; xEnd < width; xEnd++) {
//       let xStart = xEnd - matrixSize + 1;
//       //rowSums[xStart] = rowSums[xStart - 1] + pixels.get(xEnd, y) - pixels.get(xStart - 1, y)
//       rowSums[xStart] = rowSums[xStart - 1] + buffer[y*height+xEnd] - buffer[y*height+(xStart-1)];
//     }
//     rowSumsCol[y] = rowSums;
//   }
//
//   let mWidth = width - matrixSize + 1
//   let mHeight = height - matrixSize + 1
//   let mean = new Array<number>(mWidth*mHeight).fill(0);//zeros([mWidth, mHeight])
//   for (let x = 0; x < mWidth; x++) {
//     // Set x, 0
//     for (let y = 0; y < matrixSize; y++) {
//       const index = x+width*y;
//       //let prev = mean.get(x, 0)
//       mean[index] += rowSumsCol[y][x];
//       //mean.set(x, 0, prev + rowSumsCol[y][x])
//     }
//   }
//   for (let x = 0; x < mWidth; x++) {
//     for (let y = 1; y < mHeight; y++) {
//       //mean.set(x, y, mean.get(x, y - 1) - rowSumsCol[y - 1][x] + rowSumsCol[y + matrixSize - 1][x])
//       mean[x+width*y] = mean[x+width*(y-1)] - rowSumsCol[y-1][x] + rowSumsCol[y + matrixSize - 1][x];
//     }
//   }
//
//   // Devide
//   for (let x = 0; x < mWidth; x++) {
//     for (let y = 0; y < mHeight; y++) {
//       //mean.set(x, y, mean.get(x, y) / (matrixSize * matrixSize))
//       mean[x+width*y] /= (matrixSize*matrixSize);
//     }
//   }
//   return mean;
// }

function gauss() {

}

const METHODS = {
  "mean": mean,
  "gauss": gauss
};

export class Options {
  method: string = "mean";
  matrixSize: number = 3;
  compensation: number = 0;
}

export function computeAdaptiveThreshold(width: number, height: number, sourceImageData: Uint8Array, ratio) {
  var integral = buildIntegral_Gray(width, height, sourceImageData);

  var s = width >> 4; // in fact it's s/2, but since we never use s...
  var resultData = new Uint8Array(sourceImageData.byteLength);

  var x = 0, y = 0, lineIndex = 0;

  for (y = 0; y < height; y++, lineIndex += width) {
    for (x = 0; x < width; x++) {

      var value = sourceImageData[(lineIndex + x) << 2];
      var x1 = Math.max(x - s, 0);
      var y1 = Math.max(y - s, 0);
      var x2 = Math.min(x + s, width - 1);
      var y2 = Math.min(y + s, height - 1);
      var area = (x2 - x1 + 1) * (y2 - y1 + 1);
      var localIntegral = getIntegralAt(integral, width, x1, y1, x2, y2);
      if (value * area > localIntegral * ratio) {
        resultData[lineIndex + x] = 0xFF;
      } else {
        resultData[lineIndex + x] = 0;
      }
    }
  }
  return resultData;
}

function buildIntegral_Gray(width: number, height: number, sourceImageData: Uint8Array) {
  // should it be Int64 Array ??
  // Sure for big images
  var integral = new Int32Array(width * height)
  // ... for loop
  var x = 0, y = 0, lineIndex = 0, sum = 0;
  for (x = 0; x < width; x++) {
    sum += sourceImageData[x << 2];
    integral[x] = sum;
  }

  for (y = 1, lineIndex = width; y < height; y++, lineIndex += width) {
    sum = 0;
    for (x = 0; x < width; x++) {
      sum += sourceImageData[(lineIndex + x) << 2];
      integral[lineIndex + x] = integral[lineIndex - width + x] + sum;
    }
  }
  return integral;
}

function getIntegralAt(integral, width, x1, y1, x2, y2) {
  var result = integral[x2 + y2 * width];
  if (y1 > 0) {
    result -= integral[x2 + (y1 - 1) * width];
    if (x1 > 0) {
      result += integral[(x1 - 1) + (y1 - 1) * width];
    }
  }
  if (x1 > 0) {
    result -= integral[(x1 - 1) + (y2) * width];
  }
  return result;
}

// export function adaptiveThreshold(width: number, height: number, buffer: Array<Uint8Array>, options: Options): Array<Uint8Array> {
//   const midSize = Math.floor(options.matrixSize / 2);
//   const matrix = METHODS[options.method](width, height, buffer, options.matrixSize);
//   const mHeight = matrix.length;
//   const mWidth = matrix[0].length;
//   const res = new Array(height);
//   for (let h = 0; h < height; h++) {
//     res[h] = new Uint8Array(width).fill(0);
//   }
//
//   for (let y = 0; y < height; y++) {
//     for (let x = 0; x < width; x++) {
//       const pixel = buffer[y][x];
//
//       let mX = x - midSize;
//       let mY = y - midSize;
//
//       if (x - midSize < 0) {
//         mX = 0;
//       } else if (x - midSize >= mWidth) {
//         mX = mWidth - 1;
//       }
//       if (y - midSize < 0) {
//         mY = 0;
//       } else if (y - midSize >= mHeight) {
//         mY = mHeight - 1;
//       }
//
//       const mean = matrix[mY][mX];
//       const threshold = mean - options.compensation;
//       console.log("X: " + x + "; Y: " + y + "; mean: " + mean + "; threshold: " + threshold + "; value: " + pixel);
//       res[y][x] = (pixel < threshold) ? 0 : 255;
//     }
//   }
//
//   return res;
// }

// export function adaptiveThreshold(width: number, height: number, buffer: Uint8Array, options: Options): Uint8Array {
//   const midSize = Math.floor(options.matrixSize / 2);
//   const res = new Uint8Array(buffer.byteLength).fill(0);
//   const matrix = METHODS[options.method](width, height, buffer, options.matrixSize);
//
//   for (let x = 0; x < width; x++) {
//     for (let y = 0; y < height; y++) {
//       const index = x+width*y;
//       const pixel = buffer[index];
//
//       let mX = x - midSize;
//       let mY = y - midSize;
//       if (x - midSize < 0) {
//         mX = 0;
//       } else if (x - midSize >= options.matrixSize) {
//         mX = options.matrixSize - 1;
//       }
//       if (y - midSize < 0) {
//         mY = 0;
//       } else if (y - midSize > options.matrixSize) {
//         mY = options.matrixSize - 1;
//       }
//       const mean = matrix[mY * options.matrixSize + mX];
//
//       const threshold = mean - options.compensation;
//       res[index] = (pixel < threshold) ? 0 : 255;
//     }
//   }
//   return res;
// }

