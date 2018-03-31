import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import * as firebase from 'firebase';


import { Fingerprint } from "./shared/fingerprint";
import UploadTaskSnapshot = firebase.storage.UploadTaskSnapshot;
import UploadTask = firebase.storage.UploadTask;

@Injectable()
export class FingerprintService {

  private static readonly FINGERPRINT_REFERENCE = "fingerprints"

  private _fingerprints: Fingerprint[] = [];

  constructor(private _http: HttpClient) {
    firebase.database()
            .ref(FingerprintService.FINGERPRINT_REFERENCE)
            .on('child_added', this.handleChildAdded(this));
  }

  private handleChildAdded(self: FingerprintService) {
    return ((data: any) => {
      const url = data.val().url;
      const extention = data.val().extention;
      const fileName = `${data.key}.${extention}`;

      self._fingerprints.push(new Fingerprint(fileName, url));
    });
  }

  public downloadBuffer(url: string): Promise<ArrayBuffer> {
    return this._http.get(url, {responseType: "blob"})
               .toPromise()
               .then((blob: Blob) => {
                 return this.load(blob);
               });
  }

  public load(file: File | Blob): Promise<ArrayBuffer> {
    return new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const buffer = e.target.result;
        resolve(buffer);
      };
      reader.onerror = (e: any) => {
        reject(e);
      }
      reader.readAsArrayBuffer(file);
    });
  }

  private _uploadBuffer(fingerprint: Fingerprint, progressChanged: Function): UploadTask {
    const task = firebase.storage()
                         .ref(`${FingerprintService.FINGERPRINT_REFERENCE}/${fingerprint.filename}`)
                         .put(fingerprint.tiff.buffer);
    task.on('state_changed', (snapshot: UploadTaskSnapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      progressChanged(progress);
    });
    return task;
  }

  public async insert(fingerprint: Fingerprint, progressChanged: Function) {
    const name = fingerprint.filename.substr(0, fingerprint.filename.indexOf("."));
    const extention = fingerprint.filename.substr(fingerprint.filename.indexOf(".") + 1);
    this._uploadBuffer(fingerprint, progressChanged)
        .then((snapshot: UploadTaskSnapshot) => {
          const url = snapshot.metadata.downloadURLs[0];
          return firebase.database()
                         .ref(`fingerprints/${name}`)
                         .set({
                           url: url,
                           extention: extention
                         });
        });
    //const url = bucket.metadata.downloadURLs[0];

  }

  // public async insert(fingerprint: MyTiff) {
  //   const bucket = await firebase
  //     .storage()
  //     .ref(`${FingerprintService.FINGERPRINT_REFERENCE}/${fingerprint.filename}`)
  //     .put(fingerprint.buffer);
  //   const url = bucket.metadata.downloadURLs[0];
  //   // const name = fingerprint.filename.substr(0, fingerprint.filename.indexOf("."));
  //   // const extention = fingerprint.filename.substr(fingerprint.filename.indexOf(".") + 1);
  //   await firebase.database()
  //     .ref(`fingerprints/${name}`)
  //     .set({
  //       url: url,
  //       width: fingerprint.width,
  //       height: fingerprint.height,
  //       // extention: extention
  //     });
  // }

  public fingerprints(): Observable<Fingerprint[]> {
    return Observable.of(this._fingerprints);
  }
}
