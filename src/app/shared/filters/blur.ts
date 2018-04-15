import { Filter } from "../filter";
import { Closing } from "./closing";
import { merge } from "./mathematic-operations";

export class Blur implements Filter {

  private readonly _closing:Filter = new Closing();

  applyFilter(buffer: Array<Uint8Array>): Array<Uint8Array> {
    const height = buffer.length;
    const width = buffer[0].length;
    const closed = this._closing.applyFilter(buffer);
    return merge(buffer, closed);
    // const out = new Array(height);
    // for (let h = 0; h < height; h++) {
    //   out[h] = new Uint8Array(width);
	//
    //   for (let w = 0; w < width; w++) {
    //     out[h][w] = Math.max(buffer[h][w], closed[h][w]);
    //   }
    // }
	//
    // return out;

  }
}
