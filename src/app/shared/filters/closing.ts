import { Filter } from "../filter";
import { Dilatation } from "./dilatation";
import { Erosion } from "./erosion";

export class Closing implements Filter {

  private readonly _dilatation = new Dilatation();
  private readonly _erosion = new Erosion();

  constructor(private readonly _count: number = 1) {}

  applyFilter(buffer: Array<Uint8Array>): Array<Uint8Array> {
    let dilatated = this._dilatation.applyFilter(buffer);
    for (let i = 1; i < this._count; i++) {
      dilatated = this._dilatation.applyFilter(dilatated);
    }

    let eroded = this._erosion.applyFilter(dilatated);
    for (let i = 1; i < this._count; i++) {
      eroded = this._erosion.applyFilter(eroded);
    }

    return dilatated;
  }

}
