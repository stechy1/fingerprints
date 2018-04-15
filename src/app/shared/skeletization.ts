import { isMatrixSame } from "./matrix";
import { Filter } from "./filter";
import { Neighbours, NeighboursCount } from "./neighbours";

export class Skeletization implements Filter {

  constructor(private _neighboursCount: NeighboursCount = NeighboursCount.FOUR) {}

  applyFilter(buffer: Array<Uint8Array>, k: number = 300): Array<Uint8Array> {
    const height = buffer.length;
    const width = buffer[0].length;

    const U_k = new Array(height);
    const U_k_prev = new Array(height);
    for (let h = 0; h < height; h++) {
      U_k[h] = new Uint8Array(width).fill(0);
      U_k_prev[h] = new Uint8Array(width).fill(0);
    }

    // Vzdálenostní transformace
    for (var step = 1; step < k; step++) {
      // Výpočet pro n-ty krok
      for (let h = 0 + step; h < height - step; h++) {
        for (let w = 0 + step; w < width - step; w++) {
          const value = U_k_prev[h][w];
          const neightbours = new Neighbours(w, h, U_k_prev, this._neighboursCount);
          U_k[h][w] = buffer[h][w] + Math.min(value, neightbours.min);
        }
      }

      if (isMatrixSame(width, height, U_k, U_k_prev)) {
        break;
      }

      // Nakopírování pole
      for (let h = 0; h < height; h++) {
        for (let w = 0; w < width; w++) {
          U_k_prev[h][w] = U_k[h][w];
        }
      }
    }

    console.log("hotovo v: " + step + " krocích");

    // // Určení bodů skeletu
    // // U_skelet = U_k
    // // U_k = U_k_prev
    for (let h = 0; h < height; h++) {
      for (let w = 0; w < width; w++) {
        const value = U_k_prev[h][w];
        const neighbours = new Neighbours(w, h, U_k_prev, this._neighboursCount);

        if (value === 0) {
          U_k[h][w] = 1;
          continue;
        }

        const maxNeighbour = Math.max(value, neighbours.max);
        U_k[h][w] = value >= maxNeighbour ? 0 : 1;
      }
    }

    return U_k;
  }

}
