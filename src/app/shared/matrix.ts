export function toMatrix2D(width: number, height: number, buffer: Uint8Array): Array<Uint8Array> {
  const out = new Array(width);
  for (let h = 0; h < height; h++) {
    out[h] = new Uint8Array(height);
    for (let w = 0; w < width; w++) {
      out[h][w] = buffer[h * height + w];
    }
  }

  return out;
}

export function toMatrix1D(width: number, height: number, buffer: Array<Uint8Array>): Uint8Array {
  const out = new Uint8Array(width * height);
  for (let h = 0; h < height; h++) {
    for (let w = 0; w < width; w++) {
      out[h * height + w] = buffer[h][w];
    }
  }

  return out;
}
