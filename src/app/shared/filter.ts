export interface Filter {
  applyFilter(buffer: Array<Uint8Array>): Array<Uint8Array>;

  filterName(): string;
}
