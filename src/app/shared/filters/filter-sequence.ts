import { Filter } from '../filter';

export class FilterSequence implements Filter {

  constructor(private readonly filters: Filter[], private readonly onFilterApplyCallback: Function = undefined) {}

  applyFilter(buffer: Array<Uint8Array>): Array<Uint8Array> {
    let filter = this.filters[0];
    let a = filter.applyFilter(buffer);
    if (this.onFilterApplyCallback) {
      this.onFilterApplyCallback(filter.filterName(), a);
    }

    for (let i = 1; i < this.filters.length; i++) {
      filter = this.filters[i];
      a = filter.applyFilter(a);
      if (this.onFilterApplyCallback) {
        this.onFilterApplyCallback(filter.filterName(), a);
      }
    }

    return a;
  }

  filterName(): string {
    const filterNames = this.filters.map(value => value.filterName());
    return `FilterSequence: {${filterNames}}`;
  }



}
