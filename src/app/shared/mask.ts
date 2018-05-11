export class Mask {

  private readonly height: number;
  private readonly width: number;

  constructor(private mask: Array<Uint8Array>) {
    this.height = mask.length;
    this.width = mask[0].length;
  }

  public corespondWithMask(buffer: Array<Uint8Array>, x: number, y: number, maskOffsetX: number = undefined, maskOffsetY: number = undefined): number {
    if (!maskOffsetX) {
      maskOffsetX = Math.floor(this.width / 2.0);
    }
    if (!maskOffsetY) {
      maskOffsetY = Math.floor(this.height / 2.0);
    }

    const bufferHeight = buffer.length;
    const bufferWidth = buffer[0].length;
    let result = this.width*this.height;

    for (let h = 0; h < this.height; h++) {

      const offsetY = y+h-maskOffsetY;
      if (offsetY < 0 || offsetY >= bufferHeight) {
        return -1;
      }

      for (let w = 0; w < this.width; w++) {
        const maskElement = this.mask[h][w];
        // Ignoruji elementy v masce, které mají hodnotu 2
        if (maskElement === 2) {
          result--;
          continue;
        }

        // Ošetření hranic
        const offsetX = x+w-maskOffsetX;

        if (offsetX < 0 || offsetX >= bufferWidth) {
          return -1;
        }

        const bufferElement = buffer[offsetY][offsetX];
        if (maskElement === bufferElement) {
          result--;
        }
      }
    }

    return result;
  }



}
