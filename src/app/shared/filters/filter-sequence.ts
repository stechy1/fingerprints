import { Filter } from '../filter';

export class FilterSequence implements Filter {

  constructor(private readonly filters: Filter[], private readonly onFilterApplyCallback: Function = undefined) {}

  applyFilter(buffer: Array<Uint8Array>): Array<Uint8Array> {
    let a = this.filters[0].applyFilter(buffer);
    if (this.onFilterApplyCallback) {
      this.onFilterApplyCallback(a);
    }
    for (let i = 1; i < this.filters.length; i++) {
      a = this.filters[i].applyFilter(a);
      if (this.onFilterApplyCallback) {
        this.onFilterApplyCallback(a);
      }
    }

    return a;
  }

}
