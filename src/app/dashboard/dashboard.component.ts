import { Component, OnDestroy, OnInit } from '@angular/core';
import { MyTiff } from "../shared/my-tiff";
import { FingerprintService } from "../fingerprint.service";
import { Subscription } from "rxjs/Subscription";
import { AngularFireLiteDatabase } from 'angularfire-lite';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  fingerprints: MyTiff[];

  private _imageSub: Subscription;

  constructor(private _fingerprintService: FingerprintService) {}

  ngOnInit() {
    this._imageSub = this._fingerprintService.images().subscribe(value => {
      this.fingerprints = value;
    });
  }

  ngOnDestroy(): void {
    this._imageSub.unsubscribe();
  }

// handleFileChange(event) {
  //   const self = this;
  //   const file = event.target.files[0];
  //
  //   if (file) {
  //     this._fingerprintService.load(file)
  //     .then(value => {
  //       const natElement = self.canvasContainer.nativeElement;
  //       if (natElement.lastChild) {
  //         natElement.removeChild(natElement.lastChild);
  //       }
  //       natElement.appendChild(value);
  //     });
  //   }
  // }
  //
  // handleDft() {
  //   const buff = new Int32Array(this._fingerprintService.getImageBuffer());
  //   const height = this._fingerprintService.imageHeight;
  //   const width = this._fingerprintService.imageWidth;
  //   const data = new Array(height);
  //   for (let h = 0; h < height; h++) {
  //     data[h] = buff.slice(h*width, h*width + width);
  //   }
  //
  //   console.log(data);
  //
  //   const result = fourier.dft(data);
  //
  //   console.log(result);
  //
  //   const shift = fourier.shift(result);
  //
  //   const outputData = new Array();
  //   for (let row of shift) {
  //     for (let e of row) {
  //       outputData.push(e);
  //     }
  //   }
  //
  //   const outputBuffer = new Int32Array(outputData);
  //   const img = this._fingerprintService.createImageToGrayScale(outputBuffer, width, height);
  //
  //   this.canvasContainer.nativeElement.appendChild(img);
  //
  //   const inv = fourier.inverse(result);
  //   const outputDataInverse = new Array();
  //   for (let row of inv) {
  //     for (let e of row) {
  //       outputDataInverse.push(e);
  //     }
  //   }
  //
  //   const outputBufferInv = new Int32Array(outputDataInverse);
  //   const imgInv = this._fingerprintService.createImageFromRGBdata(outputBufferInv, width, height);
  //
  //   this.canvasContainer.nativeElement.appendChild(imgInv);
  // }
}
