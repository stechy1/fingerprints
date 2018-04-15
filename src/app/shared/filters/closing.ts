import { Filter } from "../filter";
import { Dilatation } from "./dilatation";
import { Erosion } from "./erosion";

export class Closing implements Filter {

  private readonly _dilatation = new Dilatation();
  private readonly _erosion = new Erosion();

  applyFilter(buffer: Array<Uint8Array>): Array<Uint8Array> {
    const dilatated = this._dilatation.applyFilter(buffer);
    const eroded = this._erosion.applyFilter(dilatated);

    return eroded;
  }

}
