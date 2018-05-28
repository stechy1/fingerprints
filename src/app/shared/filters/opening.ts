import { Filter } from '../filter';
import { Erosion } from './erosion';
import { Dilatation } from './dilatation';

export class Opening implements Filter {
  private readonly _dilatation = new Dilatation();
  private readonly _erosion = new Erosion();

  constructor(private readonly _count: number = 1) {}

  applyFilter(buffer: Array<Uint8Array>): Array<Uint8Array> {
    let eroded = this._erosion.applyFilter(buffer);
    for (let i = 1; i < this._count; i++) {
      eroded = this._erosion.applyFilter(eroded);
    }

    let dilatated = this._dilatation.applyFilter(eroded);
    for (let i = 1; i < this._count; i++) {
      dilatated = this._dilatation.applyFilter(dilatated);
    }

    return dilatated;
  }

  filterName(): string {
    return "Opening";
  }

}
