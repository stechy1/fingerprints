function mean(width: number, height: number, buffer: Array<Uint8Array>): number[][] {
  const mean = new Array(height);
  // mean[0] = new Array(width);
  // let suma = 0;
  // for (let w = 0; w < width; w++) {
  //   suma += buffer[0][w];
  //   mean[0][w] = suma;
  // }
  //
  // for (let h = 1; h < height; h++) {
  //   mean[h] = new Array(width);
  //   suma = 0;
  //   for (let w = 0; w < width; w++) {
  //     suma += buffer[h][w];
  //     mean[h][w] = suma;
  //   }
  // }
  for (let h = 0; h < height; h++) {
    mean[h] = new Array<number>(width);
    let suma = 0;
    for (let w = 0; w < width; w++) {
      suma += buffer[h][w];
      if (h == 0) {
        mean[h][w] = suma;
      } else {
        mean[h][w] = mean[h-1][w] + suma;
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

  const output = new Array(height);
  for (let h = 0; h < height; h++) {
    output[h] = new Uint8Array(width).fill(0);
  }
  const intImg = mean(width, height, buffer);
  console.log(intImg);

  let y1, y2, x1, x2, count = 0, sum = 0;
  for (let h = 0; h < height - 1; h++) {
    y1 = h - s2;
    y2 = h + s2;

    if (y1 < 0) {y1 = 0;}
    if (y2 >= height) {y2 = height - 1;}
    const countY = y2-y1;

    for (let w = 0; w < width - 1; w++) {
      x1 = w - s2;
      x2 = w + s2;

      if (x1 < 0) {x1 = 1;}
      if (x2 >= width) {x2 = width - 1;}

      count = countY * (x2-x1);

      // https://en.wikipedia.org/wiki/Summed_area_table#The_algorithm
      //      I(D)         -      I(B)      -      I(C)      +      I(A)
      sum = intImg[y2][x2] - intImg[y1][x2] - intImg[y2][x1] + intImg[y1][x1];
      if ((buffer[h][w] * count) < (sum * (1.0 - threshold))) {
        output[h][w] = 0;
      } else {
        output[h][w] = 1;
      }
    }
  }

  return output;
}
