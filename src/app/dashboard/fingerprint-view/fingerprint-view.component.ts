import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MyTiff } from "../../shared/my-tiff";

@Component({
  selector: 'app-fingerprint-view',
  templateUrl: './fingerprint-view.component.html',
  styleUrls: ['./fingerprint-view.component.css']
})
export class FingerprintViewComponent implements OnInit {

  @ViewChild('canvasContainer') canvasContainer: ElementRef;

  private _fingerprint: MyTiff;

  constructor() { }

  ngOnInit() {}

  get fingerprint(): MyTiff {
    return this._fingerprint;
  }

  @Input('fingerprint') set fingerprint(value: MyTiff) {
    this._fingerprint = value;
    if (!value) {
      return;
    }

    const natElement = this.canvasContainer.nativeElement;
    if (natElement.lastChild) {
      natElement.removeChild(natElement.lastChild);
    }
    natElement.appendChild(value.toCanvas());
  }
}
