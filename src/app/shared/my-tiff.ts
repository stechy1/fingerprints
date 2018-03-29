export class MyTiff {

  private Tiff = require('tiff.js');

  private _raw: any;


  constructor(private _filename: string, private _buffer: ArrayBuffer) {
    this._raw = new this.Tiff({buffer: _buffer});
  }

  public get width(): number {
    return this._raw.width();
  }

  public get height(): number {
    return this._raw.height();
  }

  public currentDirectory(): number {
    return this._raw.currentDirectory();
  }

  public countDirectory(): number {
    return this._raw.countDirectory();
  }

  public setDirectory(index: number): void {
    return this._raw.setDirectory(index);
  }

  public getField(tag: number): number {
    return this._raw.getField(tag);
  }

  public readRGBAImage(): ArrayBuffer {
    return this._raw.readRGBAImage();
  }

  public get buffer(): ArrayBuffer {
    return this._buffer;
  }

  public toCanvas(): HTMLCanvasElement {
    return this._raw.toCanvas();
  }

  public get imageSrc(): string {
    return this.toCanvas().toDataURL("image/png")
  }

  public toDataURL(): string {
    return this._raw.toDataURL();
  }

  public close(): void {
    return this._raw.close();
  }

  get filename(): string {
    return this._filename;
  }
}
