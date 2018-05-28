import { Filter } from "../filter";
import { Closing } from "./closing";
import { merge } from "./mathematic-operations";

export class Blur implements Filter {

  private readonly _closing:Filter = new Closing();

  applyFilter(buffer: Array<Uint8Array>): Array<Uint8Array> {
    const closed = this._closing.applyFilter(buffer);
    return merge(buffer, closed);
  }

  filterName(): string {
    return "Blur";
  }
}
