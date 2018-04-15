import { Filter } from "../filter";

class GaussGenerator {

  private readonly _sqrSigma: number;

  constructor(private _sigma: number) {
    this._sqrSigma = this._sigma * this._sigma;
  }

  private _function2D(x: number, y: number): number {
    return Math.exp((x * x + y * y) / (-2 * this._sqrSigma)) / (2 * Math.PI * this._sqrSigma);
  }

  kernel2D(size: number): number[][] {
    // raduis
    let radius = size >> 1;
    // kernel
    //double[,] kernel = new double[size, size];
    const kernel = new Array(size);
    for (let i = 0; i < size; i++) {
      kernel[i] = new Array(size).fill(0);
    }

    // compute kernel

    for (let y = -radius, i = 0; i < size; y++, i++) {
      for (let x = -radius, j = 0; j < size; x++, j++) {
        kernel[i][j] = this._function2D(x, y);
      }
    }

    return kernel;
  }

}

export class GaussianBlur implements Filter {

  private readonly _kernel: Array<Uint8Array>;
  private readonly _divisor: number;

  constructor(private _sigma: number = 1.4, private _size: number = 5) {
    // create Gaussian function
    const gaussGenerator = new GaussGenerator(this._sigma);
    // create kernel
    const kernel = gaussGenerator.kernel2D(this._size);
    let min = kernel[0][0];
    // integer kernel
    let intKernel = new Array(this._size);
    for (let i = 0; i < this._size; i++) {
      intKernel[i] = new Array(this._size).fill(0);
    }
    let divisor = 0;

    for (let i = 0; i < this._size; i++) {
      for (let j = 0; j < this._size; j++) {

        let v = kernel[i][j] / min;
        if (v > 65635) {
          v = 65635;
        }
        intKernel[i][j] = Math.floor(v);

        // collect divisor
        divisor += intKernel[i][j];
      }
    }

    // update filter
    this._kernel = intKernel;
    this._divisor = divisor;
  }

  applyFilter(buffer: Array<Uint8Array>): Array<Uint8Array> {
    const height = buffer.length;
    const width = buffer[0].length;
    const radius = this._size >> 1;
    const kernelSize = this._size * this._size
    const out = new Array(height);
    for (let i = 0; i < height; i++) {
      out[i] = new Array(width).fill(0);
    }
    let i, j, t, k, ir, jr;

    let g, div;
    let processedKernelSize;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        g = div = processedKernelSize = 0;

        for (i = 0; i < this._size; i++) {
          ir = i - radius;
          t = x + ir;

          if (t < 0) {
            continue;
          }
          if (t >= height) {
            break;
          }

          for (j = 0; j < this._size; j++) {
            jr = j - radius;
            t = y + jr;

            if (t < 0) {
              continue;
            }
            if (t >= width) {
              continue;
            }

            k = this._kernel[i][j];
            div += k;
            g += k * buffer[y + jr][x + ir];
            processedKernelSize++;
          }
        }

        if (processedKernelSize == kernelSize) {
          div = this._divisor;
        }

        if (div != 0) {
          g /= div;
        }
        out[y][x] = (g > 255) ? 255 : (g < 0) ? 0 : g;
      }
    }

    return out;
  }
}
