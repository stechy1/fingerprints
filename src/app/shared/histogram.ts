export class Histogram {

  private static readonly GRAY_SCALE = 256;

  private constructor(private _histogramData: Array<number>) {}

  public static fromImage(buffer: Uint8Array): Histogram {
    const data = new Array<number>(Histogram.GRAY_SCALE);
    data.fill(0);

    for (var i = 0; i < buffer.byteLength; i++) {
      data[buffer[i]]++;
    }

    for (let i = 0; i < data.length; i++) {
      data[i]++;
    }

    return new Histogram(data);
  }

  public static fromOtherHistogram(buffer: Array<number>): Histogram {
    return new Histogram(buffer);
  }

  public equalize(buffer: Uint8Array): Uint8Array {
    const pixelCount = buffer.byteLength;

    let sum = 0;
    const lut = new Array<number>(Histogram.GRAY_SCALE);
    for (let i = 0; i < Histogram.GRAY_SCALE; i++) {
      sum += this._histogramData[i];
      lut[i] = sum * 255.0 / pixelCount;
    }

    const output = new Uint8Array(pixelCount);
    for (let i = 0; i < pixelCount; i++) {
      const value = Math.round(lut[buffer[i]]);
      output[i] = value;
    }

    return output;
  }

  public get histogramData(): Array<number> {
    return this._histogramData;
  }
}



