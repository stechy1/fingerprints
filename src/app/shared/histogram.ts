const GRAY_SCALE = 256;

export function histogram(buffer: Uint8Array): Uint8Array {
    const data = new Uint8Array(GRAY_SCALE);
    data.fill(0);

    for (var i = 0; i < buffer.byteLength; i++) {
      data[buffer[i]]++;
    }

    for (let i = 0; i < data.length; i++) {
      data[i]++;
    }

    return data;
  }

export function equalize(buffer: Uint8Array): Uint8Array {
  const pixelCount = buffer.byteLength;

  let sum = 0;
  const lut = new Array<number>(GRAY_SCALE);
  for (let i = 0; i < GRAY_SCALE; i++) {
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
