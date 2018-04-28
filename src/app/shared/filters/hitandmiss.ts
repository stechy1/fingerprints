import { Filter } from "../filter";
// import { Erosion } from "./erosion";
// import { Dilatation } from "./dilatation";
// import { conjunction, invertBinary2D } from "./mathematic-operations";

export class HitAndMiss implements Filter {

  public static readonly MASK_ARRAY = [
    [[0, 0, 0], [-1, 1, -1], [1, 1, 1]],
    [[-1, 0, 0], [1, 1, 0], [-1, 1, -1]],
    [[1, -1, 0], [1, 1, 0], [1, -1, 0]],
    [[-1, 1, -1], [1, 1, 0], [-1, 0, 0]],
    [[1, 1, 1], [-1, 1, -1], [0, 0, 0]],
    [[-1, 1, -1], [0, 1, 1], [0, 0, -1]],
    [[0, -1, 1], [0, 1, 1], [0, -1, 1]],
    [[0, 0, -1], [0, 1, 1], [-1, 1, -1]]
  ];

  private readonly _elementSize: number;
  // private readonly erosion1: Erosion = new Erosion([
  //   [-1, -1, -1],
  //   [-1, 0, 1],
  //   [-1, 1, -1]
  // ]);
  // private readonly erosion2: Erosion = new Erosion([
  //   [1, 1, -1],
  //   [1, 0, -1],
  //   [-1, -1, -1]
  // ]);

  constructor(private _se: number[][]) {
    let s = _se[0].length

    if ((s != _se[1].length) || (s < 3) || (s > 99) || (s % 2 == 0)) {
      throw new Error("Velikost strukturního elementu neni validní");
    }

    this._elementSize = s;
  }

  applyFilter(buffer: Array<Uint8Array>): Array<Uint8Array> {
    // const left = this.erosion1.applyFilter(buffer);
    // const bufferInverted = invertBinary2D(buffer);
    // const right = this.erosion2.applyFilter(bufferInverted);
    // return conjunction(left, right);

    const height = buffer.length;
    const width = buffer[0].length;
    const out = new Array(height);
    for (let h = 0; h < height; h++) {
      out[h] = new Array(width).fill(128);
    }

    const radius = this._elementSize >> 1;
    let dstValue, pixelValue, seValue;

    // mode values

    for (let y = 0; y < height; y++) {
      // for each pixel
      for (let x = 0; x < width; x++) {
        dstValue = 255;

        // for each structuring element's row
        for (let i = 0; i < this._elementSize; i++) {
          let ir = i - radius;

          // for each structuring element's column
          for (let j = 0; j < this._elementSize; j++) {
            let jr = j - radius;

            // get structuring element's value
            seValue = this._se[j][i];

            // skip "don't care" values
            if (seValue == -1) {
              continue;
            }

            // check, if we outside
            if ((y + ir < 0) || (y + ir >= height) || (x + jr < 0) || (x + jr >= width)) {
              // if it so, the result is zero,
              // because it was required pixel
              dstValue = 0;
              break;
            }

            // get source image value
            pixelValue = buffer[y + ir][x + jr];

            if (((seValue != 0) || (pixelValue != 0)) && ((seValue != 1) || (pixelValue != 255))) {
              // failed structuring element mutch
              dstValue = 0;
              break;
            }
          }

          if (dstValue == 0) {
            break;
          }
        }
        // result pixel
        out[y][x] = dstValue;
      }
    }

    return out;
  }

}
