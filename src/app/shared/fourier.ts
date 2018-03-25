class Complex {
  constructor(public real: number, public imag: number) {}

  public abs(): number {
    return Math.sqrt((this.real * this.real) + (this.imag * this.imag));
  }
}

export function dft(data: number[][]): Complex[][] {
  const height = data.length;
  const width = data[0].length;

  const output = new Array(height);

  // Vnější cykly iterující přes výstupní data
  for (let yWave = 0; yWave < height; yWave++) {
    output[yWave] = new Array<Complex>(width);
    for (let xWave = 0; xWave < width; xWave++) {
      // Inicializace pole
      output[yWave][xWave] = new Complex(0, 0);

      // Vnitřní cykly iterující přes vstupní  data
      for (let ySpace = 0; ySpace < height; ySpace++) {
        for (let xSpace = 0; xSpace < width; xSpace++) {

          const r = (data[ySpace][xSpace] * Math.cos(2 * Math.PI * ((1.0 * xWave * xSpace / width) + (1.0 * yWave * ySpace / height)))) / Math.sqrt(width * height);
          const i = (data[ySpace][xSpace] * Math.sin(2 * Math.PI * ((1.0 * xWave * xSpace / width) + (1.0 * yWave * ySpace / height)))) / Math.sqrt(width * height);

          output[yWave][xWave].real += r;
          output[yWave][xWave].imag -= i;
        }
      }

      output[yWave][xWave].ampl = Math.sqrt(output[yWave][xWave].real * output[yWave][xWave].real + output[yWave][xWave].imag * output[yWave][xWave].imag);
    }
  }

  return output;
}

export function inverse(data: Complex[][]): number[][] {
  const height = data.length;
  const width = data[0].length;

  const output = new Array(height);

  for (let ySpace = 0; ySpace < height; ySpace++) {
    output[ySpace] = new Array<number>(width);
    for (let xSpace = 0; xSpace < width; xSpace++) {
      // Inicializace pole
      output[ySpace][xSpace] = 0;

      // Vnitřní cykly iterující přes vstupní  data
      for (let yWave = 0; yWave < height; yWave++) {
        for (let xWave = 0; xWave < width; xWave++) {

          output[ySpace][xSpace] += (
            data[yWave][xWave].real * Math.cos(2 * Math.PI * ((1.0 * xSpace * xWave / width) + (1.0 * ySpace * yWave / height)))
            - data[yWave][xWave].imag * Math.sin(2 * Math.PI * ((1.0 * xSpace * xWave / width) + (1.0 * ySpace * yWave / height))))
            / Math.sqrt(width * height);

        }
      }
    }
  }

  return output;
}

export function shift(data: Complex[][]): number[][] {
  let numberOfRows = data.length;
  let numberOfCols = data[0].length;
  let newRows;
  let newCols;

  //double[][] output = new double[numberOfRows][numberOfCols];
  let output = new Array(numberOfRows);
  for (let i = 0; i < numberOfRows; i++) {
    output[i] = new Array(numberOfCols);
  }

  //Must treat the data differently when the
  // dimension is odd than when it is even.

  if (numberOfRows % 2 != 0) { //odd
    newRows = numberOfRows + (numberOfRows + 1) / 2;
  } else { //even
    newRows = numberOfRows + numberOfRows / 2;
  } //end else

  if (numberOfCols % 2 != 0) { //odd
    newCols = numberOfCols + (numberOfCols + 1) / 2;
  } else { //even
    newCols = numberOfCols + numberOfCols / 2;
  } //end else

  //Create a temporary working array.
  //double[][] temp = new double[newRows][newCols];
  let temp = new Array(newRows);
  for (let row = 0; row < newRows; row++) {
    temp[row] = new Array(newCols);
    for (let col = 0; col < newCols; col++) {
      temp[row][col] = 0;
    } //col loop
  }

  //Copy input data into the working array.
  for (let row = 0; row < numberOfRows; row++) {
    for (let col = 0; col < numberOfCols; col++) {
      temp[row][col] = data[row][col].abs();
    } //col loop
  } //row loop

  //Do the horizontal shift first
  if (numberOfCols % 2 != 0) { //shift for odd
    //Slide leftmost (numberOfCols+1)/2 columns
    // to the right by numberOfCols columns
    for (let row = 0; row < numberOfRows; row++) {
      for (let col = 0; col < (numberOfCols + 1) / 2; col++) {
        temp[row][col + numberOfCols] = temp[row][col];
      } //col loop
    } //row loop
    //Now slide everything back to the left by
    // (numberOfCols+1)/2 columns
    for (let row = 0; row < numberOfRows; row++) {
      for (let col = 0; col < numberOfCols; col++) {
        temp[row][col] = temp[row][col + (numberOfCols + 1) / 2];
      } //col loop
    } //row loop

  } else { //shift for even
    //Slide leftmost (numberOfCols/2) columns
    // to the right by numberOfCols columns.
    for (let row = 0; row < numberOfRows; row++) {
      for (let col = 0; col < numberOfCols / 2; col++) {
        temp[row][col + numberOfCols] = temp[row][col];
      } //col loop
    } //row loop

    //Now slide everything back to the left by
    // numberOfCols/2 columns
    for (let row = 0; row < numberOfRows; row++) {
      for (let col = 0; col < numberOfCols; col++
      ) {
        temp[row][col] = temp[row][col + numberOfCols / 2];
      } //col loop
    } //row loop
  } //end else
  //Now do the vertical shift
  if (numberOfRows % 2 != 0) { //shift for odd
    //Slide topmost (numberOfRows+1)/2 rows
    // down by numberOfRows rows.
    for (let col = 0; col < numberOfCols; col++
    ) {
      for (let row = 0; row < (numberOfRows + 1) / 2; row++
      ) {
        temp[row + numberOfRows][col] = temp[row][col];
      } //row loop
    } //col loop
    //Now slide everything back up by
    // (numberOfRows+1)/2 rows.
    for (let col = 0; col < numberOfCols; col++) {
      for (let row = 0; row < numberOfRows; row++) {
        temp[row][col] = temp[row + (numberOfRows + 1) / 2][col];
      } //row loop
    } //col loop

  } else { //shift for even
    //Slide topmost (numberOfRows/2) rows down
    // by numberOfRows rows
    for (let col = 0; col < numberOfCols; col++) {
      for (let row = 0; row < numberOfRows / 2; row++) {
        temp[row + numberOfRows][col] = temp[row][col];
      } //row loop
    } //col loop

    //Now slide everything back up by
    // numberOfRows/2 rows.
    for (let col = 0; col < numberOfCols; col++) {
      for (let row = 0; row < numberOfRows; row++) {
        temp[row][col] = temp[row + numberOfRows / 2][col];
      } //row loop
    } //col loop
  } //end else

  //Shifting of the origin is complete.  Copy
  // the rearranged data from temp to output
  // array.
  for (let row = 0; row < numberOfRows; row++) {
    for (let col = 0; col < numberOfCols; col++) {
      output[row][col] = temp[row][col];
    } //col loop
  } //row loop
  return output;
}
