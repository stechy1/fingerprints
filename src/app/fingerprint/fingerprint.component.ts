import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FingerprintService } from "../fingerprint.service";
import { Fingerprint } from "../shared/fingerprint";
import { ActivatedRoute } from "@angular/router";
import * as Fourier from "../shared/fourier";
import * as Images from "../shared/images";
import { Otsu } from "../shared/otsu";
import { Histogram } from "../shared/histogram";
import { toMatrix1D, toMatrix2D } from "../shared/matrix";
import { adaptiveThreshold } from "../shared/adaptive-treshold";

@Component({
  selector: 'app-fingerprint',
  templateUrl: './fingerprint.component.html',
  styleUrls: ['./fingerprint.component.css']
})
export class FingerprintComponent implements OnInit {

  @ViewChild("container") container: ElementRef;

  fingerprint: Fingerprint;

  constructor(private _fingerprintService: FingerprintService, private _route: ActivatedRoute) { }

  ngOnInit() {
    const name = this._route.snapshot.paramMap.get('name');
    this._fingerprintService.getByIndex(name)
        .then(fingerprint => {
          this.fingerprint = fingerprint;
        });
    // this._routerSub = this._route.paramMap.subscribe(value => {
    //   const name = value.get('name');
    //   this._fingerprintService.getByIndex(name)
    //       .then((fingerprint: any) => {
    //         this.fingerprint = fingerprint;
    //       });
    // });
  }

  handleFFT() {
    const width = this.fingerprint.tiff.width;
    const height = this.fingerprint.tiff.height;
    const grayBuffer = this.fingerprint.grayBuffer;
    const fftData = Fourier.fft(width, height, grayBuffer);
    const outputFFTBuffer = Fourier.convertToIntBuffer(width, height, fftData);
    const fftCanvas = Images.createImageToGrayScale(outputFFTBuffer, width, height);
    this.container.nativeElement.appendChild(fftCanvas);
    const ifftData = Fourier.ifft(width, height, fftData);
    const outputIFFTBuffer = Fourier.convertToIntBuffer(width, height, ifftData);
    const ifftCanvas = Images.createImageToGrayScale(outputIFFTBuffer, width, height);
    this.container.nativeElement.appendChild(ifftCanvas);

  }

  handleOtsu() {
    const width = this.fingerprint.tiff.width;
    const height = this.fingerprint.tiff.height;
    const buffer = this.fingerprint.grayBuffer;
    const hist = Histogram.fromImage(buffer);

    const otsu = new Otsu(hist.histogramData, 2);
    const tresholdedBuffer = otsu.getbuffer(buffer);
    const otsuImage = Images.createImageToGrayScale(tresholdedBuffer, width, height);
    this.container.nativeElement.appendChild(otsuImage);

    const eq = hist.equalize(buffer);
    const eqHist = Histogram.fromImage(eq);
    const eqOtsu = new Otsu(eqHist.histogramData, 2);
    const eqTresholdedBuffer = eqOtsu.getbuffer(eq);
    const eqOtsuImage = Images.createImageToGrayScale(eqTresholdedBuffer, width, height);
    this.container.nativeElement.appendChild(eqOtsuImage);
  }

  handleAdaptiveThreshold() {
    const width = this.fingerprint.tiff.width;
    const height = this.fingerprint.tiff.height;
    const buffer = this.fingerprint.grayBuffer;

    const thresholded = adaptiveThreshold(width, height, toMatrix2D(width, height, buffer));
    console.log(thresholded);
    const thresholdedImage = Images.createImageToGrayScale(toMatrix1D(width, height, thresholded), width, height);
    this.container.nativeElement.appendChild(thresholdedImage);
  }
}
