import { Filter } from "../filter";
import { GaussianBlur } from "./gaussian-blur";
import { Neighbours, NeighboursCount } from "../neighbours";

export class CannyEdgeDetector implements Filter {

  private static readonly Gx = [[1, 2, 1], [-2, 0, 2], [-1, -2, -1]];
  private static readonly Gy = [[-1, 0, 1], [0, 0, 0], [-1, 0, 1]];
  // private static readonly Gx = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];
  // private static readonly Gy = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
  private static readonly MASK_SIZE = 3;

  private readonly _gaussianBlur = new GaussianBlur();

  constructor(private _lowThreshold: number = 1, private _highThreshold: number = 30) {}

  private _convolution(x: number, y: number, buffer: Array<Uint8Array>, mask: number[][], maskSize: number): number {
    const size2 = maskSize >> 1;
    let sum = 0;
    for (let h = -size2, i = 0; h <= size2; h++, i++) {
      for (let w = -size2, j = 0; w <= size2; w++, j++) {
        sum += (buffer[y + h][x + w] * mask[j][i]);
      }
    }

    return sum;
  }

  applyFilter(buffer: Array<Uint8Array>): Array<Uint8Array> {
    const height = buffer.length;
    const width = buffer[0].length;
    const cannyHeight = height - 2;
    const cannyWidth = width - 2;

    let gx, gy;
    let orientation, toAngle = 180.0 / Math.PI;
    let leftPixel = 0, rightPixel = 0;

    // 1.
    const bluredImage = this._gaussianBlur.applyFilter(buffer);

    const orients = [cannyWidth * cannyHeight].fill(0);
    const gradients = new Array(height);
    for (let i = 0; i < height; i++) {
      gradients[i] = new Array(width).fill(0);
    }
    let maxGradient = Number.NEGATIVE_INFINITY;
    let p = 0;

    // 2.
    for (let h = 1; h < height - 1; h++) {
      for (let w = 1; w < width - 1; w++, p++) {
        gx = this._convolution(w, h, bluredImage, CannyEdgeDetector.Gx, CannyEdgeDetector.MASK_SIZE);
        gy = this._convolution(w, h, bluredImage, CannyEdgeDetector.Gy, CannyEdgeDetector.MASK_SIZE);

        gradients[h][w] = Math.sqrt(gx * gx + gy * gy);
        if (gradients[h][w] > maxGradient) {
          maxGradient = gradients[h][w];
        }

        if (gx == 0) {
          orientation = (gy == 0) ? 0 : 90;
        } else {
          let div = gy / gx;

          // handle angles of the 2nd and 4th quads
          if (div < 0) {
            orientation = 180 - Math.atan(-div) * toAngle;
          }
          // handle angles of the 1st and 3rd quads
          else {
            orientation = Math.atan(div) * toAngle;
          }

          if (orientation < 22.5)
            orientation = 0;
          else if (orientation < 67.5)
            orientation = 45;
          else if (orientation < 112.5)
            orientation = 90;
          else if (orientation < 157.5)
            orientation = 135;
          else orientation = 0;
        }

        orients[p] = orientation;
      }
    }

    // 3.
    const out = new Array(height);
    for (let i = 0; i < height; i++) {
      out[i] = new Array(width).fill(0);
    }
    p = 0;
    for (let h = 1; h < height - 1; h++) {
      for (let w = 1; w < width - 1; w++, p++) {
        switch (orients[p]) {
          case 0:
            leftPixel = gradients[h - 1][w];
            rightPixel = gradients[h + 1][w];
            break;
          case 45:
            leftPixel = gradients[h - 1][w + 1];
            rightPixel = gradients[h + 1][w - 1];
            break;
          case 90:
            leftPixel = gradients[h][w + 1];
            rightPixel = gradients[h][w - 1];
            break;
          case 135:
            leftPixel = gradients[h + 1][w + 1];
            rightPixel = gradients[h - 1][w - 1];
            break;
        }
        if ((gradients[h][w] < leftPixel) || (gradients[h][w] < rightPixel)) {
          out[h][w] = 0
        }
        else {
          out[h][w] = gradients[h][w] / maxGradient * 255;
        }
      }
    }

    // 4. histereze
    for (let h = 1; h < height - 1; h++) {
      for (let w = 1; w < width - 1; w++) {
        if (out[h][w] < this._highThreshold) {
          if (out[h][w] < this._lowThreshold) {
            // non edge
            out[h][w] = 0;
          } else {
            // check 8 neighboring pixels
            const neighbours = new Neighbours(w, h, out, NeighboursCount.EIGHT);
            const max = neighbours.max;
            if (max < this._highThreshold) {
              out[h][w] = 0;
            }
          }
        }
      }
    }

    return out;
  }
}
