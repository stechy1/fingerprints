import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MyTiff } from "../shared/my-tiff";

@Component({
  selector: 'app-fingerprint-view',
  templateUrl: './fingerprint-view.component.html',
  styleUrls: ['./fingerprint-view.component.css']
})
export class FingerprintViewComponent implements OnInit {

  @ViewChild('canvasContainer') canvasContainer: ElementRef;
  @Input('max-size') maxSize: number = 300;

  imageSrc: string;

  private _fingerprint: MyTiff;

  constructor() { }

  ngOnInit() {
    console.log(this.canvasContainer);
  }

  get fingerprint(): MyTiff {
    return this._fingerprint;
  }

  @Input('fingerprint') set fingerprint(value: MyTiff) {
    this._fingerprint = value;
    if (!value) {
      return;
    }

    this.imageSrc = this._fingerprint.imageSrc;
  }
}
