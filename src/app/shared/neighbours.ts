export enum NeighboursCount {
  FOUR, EIGHT
}

export class Neighbours {

  private readonly _width: number;
  private readonly _height: number;
  private _neighbours: Array<number>;

  constructor(private _x: number, private _y: number, private _buffer: Array<Uint8Array>, private _neighbourCount: NeighboursCount = NeighboursCount.FOUR) {
    this._height = this._buffer.length;
    this._width = this._buffer[0].length;
    this._compute();
  }

  private _compute() {
    let top, topLeft, left, bottomLeft, bottom, bottomRight, right, topRight;
    top = (this._y <= 0) ? 0 : this._buffer[this._y - 1][this._x];
    topLeft = (this._y <= 0 || this._x <= 0) ? 0 : this._buffer[this._y - 1][this._x - 1];
    left = (this._x <= 0) ? 0 : this._buffer[this._y][this._x - 1];
    bottomLeft = (this._y >= this._height - 1 || this._x <= 0) ? 0 : this._buffer[this._y + 1][this._x - 1];
    bottom = (this._y >= this._height - 1) ? 0 : this._buffer[this._y + 1][this._x];
    bottomRight = (this._y >= this._height - 1 || this._x >= this._width - 1) ? 0 : this._buffer[this._y + 1][this._x + 1];
    right = (this._x >= this._width - 1) ? 0 : this._buffer[this._y][this._x + 1];
    topRight = (this._x >= this._width - 1 || this._y <= 0) ? 0 : this._buffer[this._y - 1][this._x + 1];
    switch (this._neighbourCount) {
      case NeighboursCount.FOUR:
        this._neighbours = [right, top, left, bottom];
        break;
      case NeighboursCount.EIGHT:
        this._neighbours = [right, topRight, top, topLeft, left, bottomLeft, bottom, bottomRight];
        break;
      default:
        throw new Error("Špatná velikost okolí")
    }
  }

  get neighbours(): number[] {
    return this._neighbours;
  }

  get min(): number {
    return Math.min.apply(null, this._neighbours);
  }

  get max(): number {
    return Math.max.apply(null, this._neighbours);
  }

}
