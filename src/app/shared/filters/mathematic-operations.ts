export function invertGrayScale1D(buffer: Uint8Array, value: number = 255): Uint8Array {
  return buffer.map(val => value - val);
}

export function invertGrayScale2D(buffer: Array<Uint8Array>, value: number = 255): Array<Uint8Array> {
  const height = buffer.length;
  const width = buffer[0].length;

  const out = new Array(height);
  for (let i = 0; i < height; i++) {
    out[i] = new Uint8Array(width).fill(0);
  }

  for (let h = 0; h < height; h++) {
    for (let w = 0; w < width; w++) {
      out[h][w] = value - buffer[h][w];
    }
  }

  return out;
}

export function invertBinary1D(buffer: Uint8Array): Uint8Array {
  return buffer.map(value => (value === 0) ? 1 : 0);
}

export function invertBinary2D(buffer: Array<Uint8Array>) {
  const length1 = buffer.length;
  const out = new Array(length1);
  for (let i = 0; i < length1; i++) {
    out[i] = buffer[i].map(value => (value === 0) ? 1 : 0);
  }

  return out;
}

export function scaleUp1D(buffer: Uint8Array): Uint8Array {
  return buffer.map(value => value * 255);
}

export function scaleUp2D(buffer: Array<Uint8Array>): Array<Uint8Array> {
  const length1 = buffer.length;
  const out = new Array(length1);
  for (let i = 0; i < length1; i++) {
    out[i] = buffer[i].map(value => value * 255);
  }

  return out;
}

export function merge(left: Array<Uint8Array>, right: Array<Uint8Array>): Array<Uint8Array> {
  const height = left.length;
  const width = left[0].length;
  const out = new Array(height);

  for (let h = 0; h < height; h++) {
    out[h] = new Uint8Array(width);
    for (let w = 0; w < width; w++) {
      out[h][w] = Math.max(left[h][w], right[h][w]);
    }
  }

  return out;
}

export function intersect(left: Array<Uint8Array>, right: Array<Uint8Array>): Array<Uint8Array> {
  const height = left.length;
  const width = left[0].length;
  const out = new Array(height);

  for (let h = 0; h < height; h++) {
    out[h] = new Uint8Array(width);
    for (let w = 0; w < width; w++) {
      out[h][w] = Math.min(left[h][w], right[h][w]);
    }
  }

  return out;
}
