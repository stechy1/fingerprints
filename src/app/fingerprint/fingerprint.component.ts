import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FingerprintService } from "../fingerprint.service";
import { Fingerprint } from "../shared/fingerprint";
import { ActivatedRoute } from "@angular/router";
import * as Fourier from "../shared/fourier";
import { Otsu } from "../shared/otsu";
import { toMatrix1D, toMatrix2D } from "../shared/matrix";
import { adaptiveThreshold } from "../shared/adaptive-treshold";
import { skeletize } from "../shared/skeletization";
import { createImageToGrayScale, invert2D, scaleUp } from "../shared/images";
import { histogram, equalize } from "../shared/histogram";

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
    const fftCanvas = createImageToGrayScale(width, height, outputFFTBuffer);
    this.container.nativeElement.appendChild(fftCanvas);
    const ifftData = Fourier.ifft(width, height, fftData);
    const outputIFFTBuffer = Fourier.convertToIntBuffer(width, height, ifftData);
    const ifftCanvas = createImageToGrayScale(width, height, outputIFFTBuffer);
    this.container.nativeElement.appendChild(ifftCanvas);

  }

  handleOtsu() {
    const width = this.fingerprint.tiff.width;
    const height = this.fingerprint.tiff.height;
    const buffer = this.fingerprint.grayBuffer;
    const hist = histogram(buffer);

    const otsu = new Otsu(hist, 2);
    const tresholdedBuffer = otsu.getbuffer(buffer);
    const otsuImage = createImageToGrayScale(width, height, tresholdedBuffer);
    this.container.nativeElement.appendChild(otsuImage);

    const eq = equalize(buffer);
    const eqOtsu = new Otsu(eq, 2);
    const eqTresholdedBuffer = eqOtsu.getbuffer(eq);
    const eqOtsuImage = createImageToGrayScale(width, height, eqTresholdedBuffer);
    this.container.nativeElement.appendChild(eqOtsuImage);
  }

  handleAdaptiveThreshold() {
    const width = this.fingerprint.tiff.width;
    const height = this.fingerprint.tiff.height;
    const buffer = this.fingerprint.grayBuffer;

    const thresholded = adaptiveThreshold(width, height, toMatrix2D(width, height, buffer));
    const thresholdedImage = createImageToGrayScale(width, height, scaleUp(toMatrix1D(width, height, thresholded)));
    this.container.nativeElement.appendChild(thresholdedImage);
  }

  handleSkeletize() {
    const width = this.fingerprint.tiff.width;
    const height = this.fingerprint.tiff.height;
    const buffer = this.fingerprint.grayBuffer;

    const thresholded = adaptiveThreshold(width, height, toMatrix2D(width, height, buffer));

    skeletize(width, height, invert2D(thresholded)).subscribe(value => {
      const skeletizedImage = createImageToGrayScale(width, height, scaleUp(toMatrix1D(width, height, value)));
      this.container.nativeElement.appendChild(skeletizedImage);
    });

  }
}
