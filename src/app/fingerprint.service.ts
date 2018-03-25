import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/of';

import { MyTiff } from "./shared/my-tiff";

@Injectable()
export class FingerprintService {

  private _images: MyTiff[] = [];

  constructor() {}

  public load(file: File): Promise<MyTiff> {
    return new Promise<any>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const buffer = e.target.result;
        const img = new MyTiff(file.name, buffer);
        resolve(img);
      };
      reader.onerror = (e: any) => {
        reject(e);
      }
      reader.readAsArrayBuffer(file);
    });
  }

  public insert(fingerprint: MyTiff): void {
    this._images.push(fingerprint)
  }

  public createImageFromRGBdata(data, width, height): HTMLCanvasElement {
    let mCanvas = document.createElement('canvas');
    mCanvas.width = width;
    mCanvas.height = height;

    let mContext = mCanvas.getContext('2d');
    let mImgData = mContext.createImageData(width, height);

    let dstIndex = 0;

    for (let i = 0; i < data.length; i++) {
      mImgData.data[dstIndex] = ((data[i] >> 24) & 0xFF);	// r
      mImgData.data[dstIndex + 1] = ((data[i] >> 16) & 0xFF);	// g
      mImgData.data[dstIndex + 2] = ((data[i] >> 8) & 0xFF);	// b
      mImgData.data[dstIndex + 3] = 255; // 255 = 0xFF - constant alpha, 100% opaque
      dstIndex += 4;
    }
    mContext.putImageData(mImgData, 0, 0);
    return mCanvas;
  }

  public createImageToGrayScale(data, width, height): HTMLCanvasElement {
    let mCanvas = document.createElement('canvas');
    mCanvas.width = width;
    mCanvas.height = height;

    let mContext = mCanvas.getContext('2d');
    let mImgData = mContext.createImageData(width, height);

    let dstIndex = 0;

    for (let i = 0; i < data.length; i++) {
      const value = data[i];
      const brightness = 0.34 * ((value >> 24) & 0xFF) + 0.5 * ((value >> 16) & 0xFF) + 0.16 * ((value >> 8) & 0xFF);
      // red
      mImgData.data[dstIndex] = brightness;
      // green
      mImgData.data[dstIndex + 1] = brightness;
      // blue
      mImgData.data[dstIndex + 2] = brightness;
      // alpha
      mImgData.data[dstIndex + 3] = 255;

      dstIndex += 4;
    }


    mContext.putImageData(mImgData, 0, 0);
    return mCanvas;
  }

  public images(): Observable<MyTiff[]> {
    return Observable.of(this._images);
  }
}
