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

  applyFilter(buffer: Array<Uint8Array>): Array<Uint8Array> {
    const height = buffer.length;
    const width = buffer[0].length;

    const output = new Array(height);
    for (let i = 0; i < height; i++) {
      output[i] = new Uint8Array(width).fill(0);
    }
    const intImg = this._mean(width, height, buffer);

    let x1, x2, y1, y2, count = 0, sum = 0;
    for (let j = 0; j < height - 1; j++) {
      y1 = j - this._radius;
      y2 = j + this._radius;

      if (y1 < 0) {
        y1 = 1;
      }
      if (y2 >= height) {
        y2 = height - 1;
      }

      const countY = y2 - y1;

      for (let i = 0; i < width - 1; i++) {
        x1 = i - this._radius;
        x2 = i + this._radius;

        if (x1 < 0) {
          x1 = 0;
        }
        if (x2 >= width) {
          x2 = width - 1;
        }
        count = (x2 - x1) * countY;

        // https://en.wikipedia.org/wiki/Summed_area_table#The_algorithm
        //      I(D)         -      I(B)      -      I(C)      +      I(A)
        sum = intImg[y2][x2] - intImg[y1][x2] - intImg[y2][x1] + intImg[y1][x1];
        if ((buffer[j][i] * count) < (sum * (1.0 - this._threshold))) {
          output[j][i] = 0;
        } else {
          output[j][i] = 1;
        }
      }
    }

    return output;
  }

  filterName(): string {
    return "AdaptiveThreshold";
  }

}
