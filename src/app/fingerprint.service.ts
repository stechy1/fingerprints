import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import * as firebase from 'firebase';
import 'rxjs/add/observable/of';

import { MyTiff } from "./shared/my-tiff";

@Injectable()
export class FingerprintService {

  private static readonly FINGERPRINT_REFERENCE = "fingerprints"

  private _images: MyTiff[] = [];
  private _self: FingerprintService;

  constructor(private _http: HttpClient) {
    this._self = this;
    const ref = firebase.database()
      .ref(FingerprintService.FINGERPRINT_REFERENCE)
    ref.on('child_added', this.handleChildAdded(this));
  }

  private handleChildAdded(self: FingerprintService) {
    return (data => {
      const url = data.val().url;
      const width = data.val().width;
      const height = data.val().height;
      const extention = data.val().extention;
      const fileName = `${data.key}.${extention}`;

      self._http.get(url, {responseType: "blob"}).subscribe((blob: Blob) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const buffer = e.target.result;
          const img = new MyTiff(fileName, buffer);
          console.log("Image loaded: " + fileName);
        };
        reader.readAsArrayBuffer(blob);
      });
    });
  }

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

  public async insert(fingerprint: MyTiff) {
    const bucket = await firebase
      .storage()
      .ref(`${FingerprintService.FINGERPRINT_REFERENCE}/${fingerprint.filename}`)
      .put(fingerprint.buffer);
    const url = bucket.metadata.downloadURLs[0];
    const name = fingerprint.filename.substr(0, fingerprint.filename.indexOf("."));
    const extention = fingerprint.filename.substr(fingerprint.filename.indexOf(".") + 1);
    await firebase.database()
      .ref(`fingerprints/${name}`)
      .set({
        url: url,
        width: fingerprint.width,
        height: fingerprint.height,
        extention: extention
      });
  }

  public images(): Observable<MyTiff[]> {
    return Observable.of(this._images);
  }
}
