import { Neighbours, NeighboursCount } from './neighbours';

export class ComponentType {
  public static readonly END_OF_LINE = new ComponentType(1); // Zakončení linie
  public static readonly FORK = new ComponentType(3);        // Vidlice

  private constructor(public readonly neighboursCount: number) {}
}

export class ComponentFinder {
  private static readonly FORK_MASKS: Array<Array<Uint8Array>> = [
    [
      new Uint8Array([1, 1, 0]),
      new Uint8Array([0, 0, 1]),
      new Uint8Array([1, 1, 0])
    ],
    [
      new Uint8Array([0, 1, 1]),
      new Uint8Array([1, 0, 1]),
      new Uint8Array([0, 1, 0])
    ]
  ];

  public findComponents(buffer: Array<Uint8Array>, componentType: ComponentType): Array<any> {
    const height = buffer.length;
    const width = buffer[0].length;
    const out = new Array();

    for (let h = 0; h < height; h++) {
      for (let w = 0; w < width; w++) {
        const pixel = buffer[h][w];
        if (pixel !== 0) {
          continue;
        }
        const neighbours = new Neighbours(w, h, buffer, NeighboursCount.EIGHT);
        if (neighbours.count === componentType.neighboursCount) {
          for (let i = 0; i < ComponentFinder.FORK_MASKS.length; i++) {
            const mask = ComponentFinder.FORK_MASKS[i];
            if (neighbours.corespondWithMask(mask) === 0) {
              out.push({x: w, y: h});
              break;
            }
          }
        }
      }
    }

    return out;
  }
}
