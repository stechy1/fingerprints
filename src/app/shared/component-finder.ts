import { Mask } from './mask';

export class ComponentFinder {
  private static readonly FORK_MASKS: Array<Mask> = [
    new Mask([
      new Uint8Array([1, 1, 0]),
      new Uint8Array([0, 0, 1]),
      new Uint8Array([1, 0, 1])
    ]),
    new Mask([
      new Uint8Array([1, 1, 0]),
      new Uint8Array([0, 0, 1]),
      new Uint8Array([1, 1, 0])
    ]),
    new Mask([
      new Uint8Array([0, 1, 1]),
      new Uint8Array([1, 0, 1]),
      new Uint8Array([0, 1, 0])
    ]),
    new Mask([
      new Uint8Array([0, 1, 1, 2, 2]),
      new Uint8Array([1, 0, 2, 2, 2]),
      new Uint8Array([2, 1, 0, 0, 2]),
      new Uint8Array([1, 0, 2, 2, 2]),
      new Uint8Array([0, 1, 1, 2, 2]),
    ])
  ];

  public findComponents(buffer: Array<Uint8Array>): Array<any> {
    const height = buffer.length;
    const width = buffer[0].length;
    const out = new Array();

    for (let h = 0; h < height; h++) {
      for (let w = 0; w < width; w++) {
        const pixel = buffer[h][w];
        if (pixel !== 0) {
          continue;
        }
        for (let i = 0; i < ComponentFinder.FORK_MASKS.length; i++) {
          const mask = ComponentFinder.FORK_MASKS[i];
          const result = mask.corespondWithMask(buffer, w, h);
          if (result === 0) {
            out.push({x: w, y: h});
            break;
          }
        }
      }
    }

    return out;
  }
}
