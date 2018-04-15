import { Filter } from "../filter";

export class Erosion implements Filter {

  private static readonly STRUCTURING_ELEMENT = [[1, 1, 1], [1, 1, 1], [1, 1, 1]];

  private readonly _windowSize: number;

  constructor(private _se: number[][] = Erosion.STRUCTURING_ELEMENT) {
    this._windowSize = this._se.length;
  }

  applyFilter(buffer: Array<Uint8Array>): Array<Uint8Array> {
    const height = buffer.length;
    const width = buffer[0].length;
    const radius = this._windowSize >> 1;
    const out = new Array(height);
    for (let h = 0; h < height; h++) {
      out[h] = new Uint8Array(width).fill(0);
    }
    let foundSomething: boolean;

    for (let y = 1; y < height-1; y++) {
      let min, v, t, ir, jr, i, j;
      for (let x = 1; x < width-1; x++) {
        min = 255;
        foundSomething = false;

        for (i = 0; i < this._windowSize; i++) {
          ir = i - radius;
          t = x + ir;

          if (t < 0) {
            continue;
          }
          if (t >= height) {
            break;
          }

          for (j = 0; j < this._windowSize; j++) {
            jr = j - radius;
            t = y + jr;

            if (t < 0) {
              continue;
            }
            if (t >= width) {
              continue;
            }

            if (this._se[i][j] === 1) {
              foundSomething = true;
              v = buffer[y+jr][x+ir];

              if (v < min)
                min = v;
            }
          }
        }

        out[y][x] = foundSomething ? min : buffer[y][x];
      }
    }

    return out;
  }

}
