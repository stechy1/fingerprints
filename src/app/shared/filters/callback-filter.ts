import { Filter } from '../filter';

export class CallbackFilter implements Filter {

  constructor(private readonly callback: Function, private readonly name: string) {}

  applyFilter(buffer: Array<Uint8Array>): Array<Uint8Array> {
    return this.callback(buffer);
  }

  filterName(): string {
    return `CallbackFilter{${this.name}}`;
  }

}
