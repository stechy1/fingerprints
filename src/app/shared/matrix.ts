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

export function isMatrixSame(width: number, height: number, left: any, right: any): boolean {
  for (let w = 0; w < width; w++) {
    for (let h = 0; h < height; h++) {
      if (left[w][h] != right[w][h]) {
        return false;
      }
    }
  }

  return true;
}

export function serialize1D(width: number, height: number, buffer: Uint8Array): string {
  let out = "";

  for (let w = 0; w < width; w++) {
    for (let h = 0; h < height; h++) {
      out += buffer[w + width * h];
    }

    out += "\n";
  }

  return out;
}

export function serialize2D(buffer: Array<Uint8Array>): string {
  const width = buffer.length;
  const height = buffer[0].length;
  let out = "";

  for (let w = 0; w < width; w++) {
    for (let h = 0; h < height; h++) {
      out += buffer[w][h];
    }

    out += "\n";
  }

  return out;
}
