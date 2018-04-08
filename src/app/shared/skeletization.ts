import { Observable } from "rxjs/Observable";
import { Subscriber } from "rxjs/Subscriber";
import { isMatrixSame } from "./matrix";

function neighbour4(x: number, y: number, width: number, height: number, buffer: Array<Uint8Array>, type: string): number {
  let top, left, bottom, right, center;
  top =  (y <= 0) ? 0 : buffer[x][y-1];
  left = (x <= 0) ? 0 : buffer[x-1][y];
  bottom = (y >= height - 1) ? 0 : buffer[x][y+1];
  right = (x >= width - 1) ? 0 : buffer[x+1][y];
  center = buffer[x][y];

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
  top =  (y <= 0) ? 0 : buffer[x][y-1];
  topLeft = (y <= 0 || x <= 0) ? 0 : buffer[x-1][y-1];
  left = (x <= 0) ? 0 : buffer[x-1][y];
  bottomLeft = (y >= height - 1 || x <= 0) ? 0 : buffer[x-1][y+1];
  bottom = (y >= height - 1) ? 0 : buffer[x][y+1];
  bottomRight = (y >= height - 1 || x >= width - 1) ? 0 : buffer[x+1][y+1];
  right = (x >= width - 1) ? 0 : buffer[x+1][y];
  topRight = (x >= width - 1 || y <= 0) ? 0 : buffer[x+1][y-1];
  center = buffer[x][y];

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
  let skelet = new Array(width);
  for (let i = 0; i < width; i++) {
    skelet[i] = new Uint8Array(height).fill(0);
  }

  for (let w = 0; w < width; w++) {
    for (let h = 0; h < height; h++) {
      const value = data[w][h];

      if (value === 0) {
        skelet[w][h] = 1;
        continue;
      }

      const maxNeighbour = neighbour4(w, h, width, height, data, 'max');
      skelet[w][h] = value >= maxNeighbour ? 0 : 1;
    }
  }

  subscriber.next(skelet);
}

export function skeletize(width: number, height: number, buffer: Array<Uint8Array>): Observable<Array<Uint8Array>> {
  return new Observable(subscriber => {
    const k = width; // Počet kroků
    const U_k = new Array(width);
    const U_k_prev = new Array(width);
    for (let i = 0; i < width; i++) {
      U_k[i] = new Uint8Array(height).fill(0);
      U_k_prev[i] = new Uint8Array(height).fill(0);
    }

    // Vzdálenostní transformace
    for (var step = 1; step < k; step++) {
      // Výpočet pro n-ty krok
      for (let w = 0 + step; w < width - step; w++) {
        for (let h = 0 + step; h < height - step; h++) {
          U_k[w][h] = buffer[w][h] + neighbour4(w, h, width, height, U_k_prev, 'min');
        }
      }

      if (isMatrixSame(width, height, U_k, U_k_prev)) {
        break;
      }

      // Nakopírování pole
      for (let w = 0; w < width; w++) {
        for (let h = 0; h < height; h++) {
          U_k_prev[w][h] = U_k[w][h];
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
