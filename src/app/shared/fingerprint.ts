import { MyTiff } from "./my-tiff";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";

export class Fingerprint {

  public static fromBuffer(filename: string, buffer: ArrayBuffer): Fingerprint {
    const f = new Fingerprint(filename);
    f.buffer = buffer;
    return f;
  }

  private _imageBehaviour = new BehaviorSubject("/assets/loading.gif");

  private _tiff: MyTiff;

  public fingerprintImageSource: Observable<string> = this._imageBehaviour.asObservable();

  constructor(private _filename: string, private _url: string = undefined) {}

  public set buffer(buffer: ArrayBuffer) {
    if (this._tiff) {
      throw new Error("Buffer is already assigned");
    }

    this._tiff = new MyTiff(buffer);
    this._imageBehaviour.next(this._tiff.imageSrc);
  }

  public get tiff(): MyTiff {
    return this._tiff;
  }

  get filename(): string {
    return this._filename;
  }

  get url(): string {
    return this._url;
  }
}
