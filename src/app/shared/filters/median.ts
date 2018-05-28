import { Filter } from '../filter';

export class Median implements Filter {

  private static readonly STRUCTURING_ELEMENT = [[1, 1, 1], [1, 1, 1], [1, 1, 1]];

  private readonly _windowSize: number;

  constructor(private _se: number[][] = Median.STRUCTURING_ELEMENT) {
    this._windowSize = this._se.length
  }

  applyFilter(buffer: Array<Uint8Array>): Array<Uint8Array> {
    const height = buffer.length;
    const width = buffer[0].length;
    const radius = this._windowSize >> 1;
    const out = new Array(height);
    for (let h = 0; h < height; h++) {
      out[h] = new Uint8Array(width).fill(0);
    }
    let c = 0, t = 0;
    let tmpArray = new Uint8Array(this._windowSize * this._windowSize).fill(0);

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        c = 0;
        tmpArray.fill(0);

        for (let i = -radius, maskY = 0; i <= radius; i++, maskY++) {
          t = y + i;

          if (t < 0) {
            continue;
          }
          if (t >= height) {
            break;
          }

          for (let j = -radius, maskX = 0; j <= radius; j++, maskX++) {
            t = x + j;

            if (t < 0) {
              continue;
            }
            if (t >= width) {
              continue;
            }

            const maskElement = this._se[maskY][maskX];
            if (maskElement === 1) {
              tmpArray[c++] = buffer[y + i][x + j];
            }

          }
        }

        tmpArray.sort();
        out[y][x] = tmpArray[tmpArray.length - (c >> 1)];
      }
    }

    return out;
  }

  filterName(): string {
    return "Median";
  }

}
