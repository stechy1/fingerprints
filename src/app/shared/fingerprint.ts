import { MyTiff } from "./my-tiff";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import * as Images from "./images";

export class Fingerprint {

  public static fromBuffer(filename: string, buffer: ArrayBuffer): Fingerprint {
    const f = new Fingerprint(filename);
    f.buffer = buffer;
    return f;
  }

  private _imageBehaviour = new BehaviorSubject(undefined);

  private _tiff: MyTiff;

  public fingerprintImageSource: Observable<string> = this._imageBehaviour.asObservable();

  constructor(private _filename: string, private _url: string = undefined) {}

  public set buffer(buffer: ArrayBuffer) {
    if (this._tiff) {
      return;
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

  get name(): string {
    return this._filename.substr(0, this._filename.indexOf("."));
  }

  get extention(): string {
    return this._filename.substr(this._filename.indexOf("."));
  }

  get url(): string {
    return this._url;
  }

  get grayBuffer(): Uint8Array {
    const raw = this.tiff.readRGBAImage();
    const rgbBuffer = new Int32Array(raw);
    return Images.toGrayScale(rgbBuffer);
  }

  get whiteBlackBuffer(): Uint8Array {
    const raw = this.tiff.readRGBAImage();
    const rgbBuffer = new Int32Array(raw);
    return Images.toBinaryScale(rgbBuffer);
  }
}
