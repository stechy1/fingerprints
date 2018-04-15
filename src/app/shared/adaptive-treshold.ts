import { Filter } from "./filter";

export class AdaptiveTreshold implements Filter {

  private readonly _radius: number;

  constructor(private _windowSize: number = 13, private _threshold = 0.025) {
    this._radius = this._windowSize >> 1;
  }

  private _mean(width: number, height: number, buffer: Array<Uint8Array>): number[][] {
    const mean = new Array(height);
    for (let h = 0; h < height; h++) {
      mean[h] = new Array<number>(width);
      let suma = 0;
      for (let w = 0; w < width; w++) {
        suma += buffer[h][w];
        if (h == 0) {
          mean[h][w] = suma;
        } else {
          mean[h][w] = mean[h - 1][w] + suma;
        }
      }
    }

    return mean;
  }

  // applyFilter(buffer: Array<Uint8Array>): Array<Uint8Array> {
  //   const height = buffer.length;
  //   const width = buffer[0].length;
  //   const widthM1 = width - 2;
  //   const heightM1 = height - 2;
  //   const avgBrightnessPart = 1.0 - this._pixelBrightnessDifferenceLimit;
  //   const integralImage = this._mean(width, height, buffer);
  //
  //   const out = new Array(height);
  //   for (let h = 0; h < height; h++) {
  //     out[h] = new Uint8Array(width).fill(0);
  //   }
  //
  //   for (let h = 0; h < height; h++) {
  //     let y1 = h - this._radius;
  //     let y2 = h + this._radius;
  //
  //     if (y1 < 0) {
  //       y1 = 0;
  //     }
  //     if (y2 > heightM1) {
  //       y2 = heightM1;
  //     }
  //
  //     y2++;
  //
  //     for (let w = 0; w < width; w++) {
  //       let x1 = w - this._radius;
  //       let x2 = w + this._radius;
  //
  //       if (x1 < 0) {
  //         x1 = 0;
  //       }
  //       if (x2 > widthM1) {
  //         x2 = widthM1;
  //       }
  //
  //       x2++;
  //
  //       //       // https://en.wikipedia.org/wiki/Summed_area_table#The_algorithm
  //       //       //      I(D)         -      I(B)      -      I(C)      +      I(A)
  //       const sum = integralImage[y2][x2] + integralImage[y1][x1] - integralImage[y2][x1] - integralImage[y1][x2];
  //       const count = ((x2 - x1) * (y2 - y1))
  //       const value = (sum / count) * avgBrightnessPart;
  //
  //       out[h][w] = (buffer[h][w]) < value ? 1 : 0;
  //     }
  //   }
  //
  //   return out;
  // }

  applyFilter(buffer: Array<Uint8Array>): Array<Uint8Array> {
    const height = buffer.length;
    const width = buffer[0].length;

    const output = new Array(width);
    for (let i = 0; i < width; i++) {
      output[i] = new Uint8Array(height).fill(0);
    }
    const intImg = this._mean(width, height, buffer);

    let x1, x2, y1, y2, count = 0, sum = 0;
    for (let i = 0; i < width - 1; i++) {
      x1 = i - this._radius;
      x2 = i + this._radius;

      if (x1 < 0) {x1 = 0;}
      if (x2 >= width) {x2 = width - 1;}
      const countX = x2-x1;

      for (let j = 0; j < height - 1; j++) {
        y1 = j - this._radius;
        y2 = j + this._radius;

        if (y1 < 0) {y1 = 1;}
        if (y2 >= height) {y2 = height - 1;}

        count = countX * (y2-y1);

        // https://en.wikipedia.org/wiki/Summed_area_table#The_algorithm
        //      I(D)         -      I(B)      -      I(C)      +      I(A)
        sum = intImg[x2][y2] - intImg[x2][y1] - intImg[x1][y2] + intImg[x1][y1];
        if ((buffer[i][j] * count) < (sum * (1.0 - this._threshold))) {
          output[i][j] = 0;
        } else {
          output[i][j] = 1;
        }
      }
    }

    return output;
  }

}
