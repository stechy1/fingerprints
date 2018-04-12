export class Otsu {

  private _thresholds: Array<number>;
  private _maxSum: number;

  constructor(private _histogram: Uint8Array, private _classes: number) {
    this._compute();
  }

  private _buildTables(histogram: Uint8Array): Uint8Array {
    // Create cumulative sum tables.
    let P = new Array(histogram.length + 1);
    let S = new Array(histogram.length + 1);
    P[0] = 0;
    S[0] = 0;

    let sumP = 0;
    let sumS = 0;

    for (let i = 0; i < histogram.length; i++) {
      sumP += histogram[i];
      sumS += i * histogram[i];
      P[i + 1] = sumP;
      S[i + 1] = sumS;
    }

    // Calculate the between-class variance for the interval u-v
    let H = new Uint8Array(histogram.length * histogram.length);
    H.fill(0.);

    for (let u = 0; u < histogram.length; u++)
      for (let v = u + 1; v < histogram.length; v++)
        H[v + u * histogram.length] = Math.pow(S[v] - S[u], 2) / (P[v] - P[u]);

    return H;
  }

  private _forLoop(H: Uint8Array, u: number, vmax: number, level: number, levels: number, index: Array<number>): void {
    let classes = index.length - 1;

    for (let i = u; i < vmax; i++) {
      index[level] = i;

      if (level + 1 >= classes) {
        // Reached the end of the for loop.

        // Calculate the quadratic sum of al intervals.
        let sum = 0.;

        for (let c = 0; c < classes; c++) {
          let u = index[c];
          let v = index[c + 1];
          let s = H[v + u * levels];
          sum += s;
        }

        if (this._maxSum < sum) {
          // Return calculated threshold.
          this._thresholds = index.slice(1, index.length - 1);
          this._maxSum = sum;
        }
      } else
      // Start a new for loop level, one position after current one.
        this._forLoop(H,
          i + 1,
          vmax + 1,
          level + 1,
          levels,
          index);
    }
  }

  private _compute(): void {
    this._maxSum = 0.;
    this._thresholds = new Array(this._classes - 1);
    this._thresholds.fill(0);
    let H = this._buildTables(this._histogram);
    let index = new Array<number>(this._classes + 1);
    index[0] = 0;
    index[index.length - 1] = this._histogram.length - 1;

    this._forLoop(H,
      1,
      this._histogram.length - this._classes + 1,
      1,
      this._histogram.length,
      index);
  }

  public getbuffer(sourceBuffer: Uint8Array): Uint8Array {
    const colors = new Array(this._classes);

    for (let i = 0; i < this._classes; i++) {
      colors[i] = Math.round(255 * i / (this._classes - 1));
    }

    let colorTable = new Array(256);
    let j = 0;

    for (let i = 0; i < colorTable.length; i++) {
      if (j < this._thresholds.length && i >= this._thresholds[j]) {
        j++;
      }

      colorTable[i] = colors[j];
    }

    const buffer = new Uint8Array(sourceBuffer.byteLength);
    for (let i = 0; i < sourceBuffer.byteLength; i++) {
      buffer[i] = colorTable[sourceBuffer[i]];
    }

    return buffer;
  }
}
