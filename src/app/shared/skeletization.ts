import { Observable } from "rxjs/Observable";
import { Subscriber } from "rxjs/Subscriber";
import { isMatrixSame } from "./matrix";

function neighbour4(x: number, y: number, width: number, height: number, buffer: Array<Uint8Array>, type: string): number {
  let top, left, bottom, right, center;
  top = (y <= 0) ? 0 : buffer[y - 1][x];
  left = (x <= 0) ? 0 : buffer[y][x - 1];
  bottom = (y >= height - 1) ? 0 : buffer[y + 1][x];
  right = (x >= width - 1) ? 0 : buffer[y][x + 1];
  center = buffer[y][x];

  switch (type) {
    case "min":
      return Math.min(top, left, bottom, right, center);
    case "max":
      return Math.max(top, left, bottom, right, center);
    default:
      throw new Error("Illegal argument");
  }
}

function neighbour8(x: number, y: number, width: number, height: number, buffer: Array<Uint8Array>, type: string): number {
  let top, topLeft, left, bottomLeft, bottom, bottomRight, right, topRight, center;
  top = (y <= 0) ? 0 : buffer[y - 1][x];
  topLeft = (y <= 0 || x <= 0) ? 0 : buffer[y - 1][x - 1];
  left = (x <= 0) ? 0 : buffer[y][x - 1];
  bottomLeft = (y >= height - 1 || x <= 0) ? 0 : buffer[y + 1][x - 1];
  bottom = (y >= height - 1) ? 0 : buffer[y + 1][x];
  bottomRight = (y >= height - 1 || x >= width - 1) ? 0 : buffer[y + 1][x + 1];
  right = (x >= width - 1) ? 0 : buffer[y][x + 1];
  topRight = (x >= width - 1 || y <= 0) ? 0 : buffer[y - 1][x + 1];
  center = buffer[y][x];

  switch (type) {
    case "min":
      return Math.min(top, topLeft, left, bottomLeft, bottom, bottomRight, right, topRight, center);
    case "max":
      return Math.max(top, topLeft, left, bottomLeft, bottom, bottomRight, right, topRight, center);
    default:
      throw new Error("Illegal argument");
  }
}

function notifyObserver(subscriber: Subscriber<Array<Uint8Array>>, width: number, height: number, data: Array<Uint8Array>): void {
  let skelet = new Array(height);
  for (let h = 0; h < height; h++) {
    skelet[h] = new Uint8Array(width).fill(0);
  }

  for (let h = 0; h < height; h++) {
    for (let w = 0; w < width; w++) {
      const value = data[h][w];

      if (value === 0) {
        skelet[h][w] = 1;
        continue;
      }

      const maxNeighbour = neighbour4(w, h, width, height, data, 'max');
      skelet[h][w] = value >= maxNeighbour ? 0 : 1;
    }
  }

  subscriber.next(skelet);
}

export function skeletize(width: number, height: number, buffer: Array<Uint8Array>): Observable<Array<Uint8Array>> {
  return new Observable(subscriber => {
    const k = width; // Počet kroků
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
          U_k[h][w] = buffer[h][w] + neighbour4(w, h, width, height, U_k_prev, 'min');
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

      notifyObserver(subscriber, width, height, U_k);

    }

    notifyObserver(subscriber, width, height, U_k);
    console.log("hotovo v: " + step + " krocích");

    // // Určení bodů skeletu
    // // U_skelet = U_k
    // // U_k = U_k_prev
    // for (let w = 0; w < width; w++) {
    //   for (let h = 0; h < height; h++) {
    //     const value = U_k_prev[w][h];
    //
    //     // if (value === 0) {
    //     //   U_k[w][h] = 1;
    //     //   continue;
    //     // }
    //
    //     const maxNeighbour = neighbour4(w, h, width, height, U_k_prev, 'max');
    //     U_k[w][h] = value >= maxNeighbour ? 1 : 0;
    //   }
    // }

    //return U_k;
  });

}
