function mean(width: number, height: number, buffer: Array<Uint8Array>): number[][] {
  const mean = new Array(width);
  for (let i = 0; i < width; i++) {
    mean[i] = new Array<number>(height);
    let suma = 0;
    for (let j = 0; j < height; j++) {
      suma += buffer[i][j];
      if (i == 0) {
        mean[i][j] = suma;
      } else {
        mean[i][j] = mean[i - 1][j] + suma;
      }
    }
  }

  return mean;
}

export function adaptiveThreshold(width: number, height: number, buffer: Array<Uint8Array>,
                                  options: {windowSize: number, threshold: number} = null): Array<Uint8Array> {
  const s = (options && options.windowSize) || 13;
  const s2 = Math.floor(s/2);
  const threshold = (options && options.threshold) || 0.025;

  const output = new Array(width);
  for (let i = 0; i < width; i++) {
    output[i] = new Uint8Array(height).fill(0);
  }
  const intImg = mean(width, height, buffer);

  let x1, x2, y1, y2, count = 0, sum = 0;
  for (let i = 0; i < width - 1; i++) {
    x1 = i - s2;
    x2 = i + s2;

    if (x1 < 0) {x1 = 0;}
    if (x2 >= width) {x2 = width - 1;}
    const countX = x2-x1;

    for (let j = 0; j < height - 1; j++) {
      y1 = j - s2;
      y2 = j + s2;

      if (y1 < 0) {y1 = 1;}
      if (y2 >= height) {y2 = height - 1;}

      count = countX * (y2-y1);

      // https://en.wikipedia.org/wiki/Summed_area_table#The_algorithm
      //      I(D)         -      I(B)      -      I(C)      +      I(A)
      sum = intImg[x2][y2] - intImg[x2][y1] - intImg[x1][y2] + intImg[x1][y1];
      if ((buffer[i][j] * count) < (sum * (1.0 - threshold))) {
        output[i][j] = 0;
      } else {
        output[i][j] = 255;
      }
    }
  }

  return output;
}
