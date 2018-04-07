export function toMatrix2D(width: number, height: number, buffer: Uint8Array): Array<Uint8Array> {
  const out = new Array(width);
  for (let w = 0; w < width; w++) {
    out[w] = new Uint8Array(height);
    for (let h = 0; h < height; h++) {
      out[w][h] = buffer[w + width * h];
    }
  }

  return out;
}

export function toMatrix1D(width: number, height: number, buffer: Array<Uint8Array>): Uint8Array {
  const out = new Uint8Array(width * height);
  for (let w = 0; w < width; w++) {
    for (let h = 0; h < height; h++) {
      out[w + width * h] = buffer[w][h];
    }
  }

  return out;
}
