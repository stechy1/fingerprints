import { Filter } from "../filter";
import { Dilatation } from "./dilatation";
import { Erosion } from "./erosion";

export class Closing implements Filter {

  private readonly _dilatation;
  private readonly _erosion;

  constructor(private readonly _se: number[][] = undefined, private readonly _count: number = 1) {
    if (!this._se) {
      this._dilatation = new Dilatation();
      this._erosion = new Erosion();
    } else {
      this._dilatation = new Dilatation(this._se);
      this._erosion = new Erosion(this._se);
    }
  }

  applyFilter(buffer: Array<Uint8Array>): Array<Uint8Array> {
    let dilatated = this._dilatation.applyFilter(buffer);
    for (let i = 1; i < this._count; i++) {
      dilatated = this._dilatation.applyFilter(dilatated);
    }

    let eroded = this._erosion.applyFilter(dilatated);
    for (let i = 1; i < this._count; i++) {
      eroded = this._erosion.applyFilter(eroded);
    }

    return eroded;
  }

  filterName(): string {
    return "Closing";
  }
}
