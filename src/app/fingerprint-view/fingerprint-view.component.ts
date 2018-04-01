import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Fingerprint } from "../shared/fingerprint";
import { FingerprintService } from "../fingerprint.service";

@Component({
  selector: 'app-fingerprint-view',
  templateUrl: './fingerprint-view.component.html',
  styleUrls: ['./fingerprint-view.component.css']
})
export class FingerprintViewComponent implements OnInit {

  private _fingerprint: Fingerprint;

  @ViewChild('canvasContainer') canvasContainer: ElementRef;
  @Input('max-size') maxSize: number = 300;

  imageSrc: Observable<string>;

  constructor(private _fingerprintService: FingerprintService) {
  }

  ngOnInit() {
    // this.imageSrc = this._fingerprint.fingerprintImageSource;
    // if (this._fingerprint.url) {
    //   this._fingerprintService.downloadBuffer(this._fingerprint.url)
    //   .then(buffer => {
    //     this._fingerprint.buffer = buffer;
    //   });
    // }
  }

  get fingerprint(): Fingerprint {
    return this._fingerprint;
  }

  @Input('fingerprint') set fingerprint(value: Fingerprint) {
    this._fingerprint = value;
    if (!value) {
      return;
    }

    if (this._fingerprint.fingerprintImageSource) {
      this.imageSrc = this.fingerprint.fingerprintImageSource;
    }
    if (this._fingerprint.url) {
      this._fingerprintService.downloadBuffer(this._fingerprint.url)
          .then(buffer => {
            this._fingerprint.buffer = buffer;
          });
    }
  }
}
