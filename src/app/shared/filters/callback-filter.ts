import { Filter } from '../filter';

export class CallbackFilter implements Filter {

  constructor(private readonly callback: Function) {}

  applyFilter(buffer: Array<Uint8Array>): Array<Uint8Array> {
    return this.callback(buffer);
  }

}
