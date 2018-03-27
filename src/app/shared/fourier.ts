export class Complex {
  constructor(public real: number, public imag: number) {
  }

  static copy(other: Complex) {
    return new Complex(other.real, other.imag);
  }

  static add(left: Complex, right: Complex) {
    return new Complex(left.real + right.real, left.imag + right.imag);
  }

  static sub(left: Complex, right: Complex) {
    return new Complex(left.real - right.real, left.imag - right.imag);
  }

  static mul(left: Complex, right: Complex) {
    return new Complex(
      left.real * right.real - left.imag * right.imag,
      left.real * right.imag + left.imag * right.real
    );
  }

  public abs(): number {
    return Math.sqrt((this.real * this.real) + (this.imag * this.imag));
  }

}

function convertToComplex(width: number, height: number, buffer: Uint8Array|Uint16Array|Uint32Array): Complex[] {
  if (buffer.byteLength !== width * height) {
    throw Error("Velikosti polí nesedí");
  }

  const output = new Array<Complex>(width * height);
  let i = 0;
  for (let h = 0; h < height; h++) {
    for (let w = 0; w < width; w++) {
      output[w + h * width] = new Complex(buffer[i++], 0);
    }
  }

  return output;
}

export function convertToIntBuffer(width: number, height: number, data: Complex[]): Uint8Array {
  const buffer = data.map(value => value.real);

  return new Uint8Array(buffer);
}

function split(data: Complex[]): { even: Complex[], odd: Complex[] } {
  const size = data.length;
  const even = new Array<Complex>(); // Sudy
  const odd = new Array<Complex>(); // Lichy

  for (let i = 0; i < size; i++) {
    if (i & 1) {
      odd.push(data[i]);
    } else {
      even.push(data[i]);
    }
  }

  return {
    even: even,
    odd: odd
  }
}

function max(width: number, height: number, data: Complex[]): number {
  let max = 0;
  for (let a = 0; a < height; a++) {
    for (let b = 0; b < width; b++) {
      let hodnota = Math.abs(data[b + a * width].real);
      if (max < hodnota) {
        max = hodnota;
      }
    }
  }

  return max
}

function normalize(width: number, height: number, data: Complex[]) {
  const maxValue = max(width, height, data);
  const bigInt = Math.pow(2, 32);

  for (let i = 0; i < width*height; i++) {
    let value = Math.abs(data[i].real);
    value = (value * bigInt) / (maxValue + 1);
    value = Math.log2(value + 1) * 8;
    data[i].real = value;
  }
}

function matrixToRow(width: number, height: number, index: number, input: Complex[]): Array<Complex> {
  const output = new Array<Complex>(width);
  for (let w = 0; w < width; w++) {
    output[w] = input[index * height + w];
  }

  return output;
}

function matrixToColumn(width: number, height: number, index: number, input: Complex[]): Array<Complex> {
  const output = new Array<Complex>(width);
  for (let h = 0; h < height; h++) {
    output[h] = input[index + width * h];
  }

  return output;
}

function rowToMatrix(width: number, height: number, index: number, input: Complex[], output: Complex[]): void {
  for (let w = 0; w < width; w++) {
    output[index * height + w] = input[w];
  }
}

function columnToMatrix(width: number, height: number, index: number, input: Complex[], output: Complex[]): void {
  for (let h = 0; h < height; h++) {
    output[index + width * h] = input[h];
  }
}

function dftRows(width: number, height: number, data: Complex[]) {
  for (let h = 0; h < height; h++) {
    const row = matrixToRow(width, height, h, data);

    dft(row);

    rowToMatrix(width, height, h, row, data);
  }
}

function dftColumns(width: number, height: number, data: Complex[]) {
  for (let w = 0; w < width; w++) {
    const column = matrixToColumn(width, height, w, data);

    dft(column);

    columnToMatrix(width, height, w, column, data);
  }
}

export function dft(data: Complex[]) {
  const size = data.length;
  if (size <= 1) {
    return;
  }

  const tmp = split(data);

  dft(tmp.even);
  dft(tmp.odd);

  for (let i = 0; i < (size >> 1); i++) {
    const polar = Complex.mul(
      new Complex(
        Math.cos(-2 * Math.PI * i / size),
        Math.sin(-2 * Math.PI * i / size)
      ), tmp.odd[i]
    );

    data[i] = Complex.add(tmp.even[i], polar);
    data[i + (size >> 1)] = Complex.sub(tmp.even[i], polar);
  }
}

export function fft(width: number, height: number, buffer: Uint8Array|Uint16Array|Uint32Array): Complex[] {
  // preprocessing
  const data = convertToComplex(width, height, buffer);

  // dft
  dftRows(width, height, data);
  dftColumns(width, height, data);

  // postprocessing
  normalize(width, height, data);
  shift(width, height, data);

  return data;

}

function shift(width: number, height: number, data: Complex[]): void {
  for (let i = 0; i < width/2; i++) {
    for (let j = 0; j < height/2; j++) {
      let tmp = Complex.copy(data[i + j * width]);
      data[i + j * width] = data[i + width / 2 + (j + height / 2) * width];
      data[i + width / 2 + (j + height / 2) * width] = tmp;
      tmp = Complex.copy(data[i + (j + height / 2) * width]);
      data[i + (j + height / 2) * width] = data[i + width / 2 + j * width];
      data[i + width / 2 + j * width] = tmp;
    }
  }
}
