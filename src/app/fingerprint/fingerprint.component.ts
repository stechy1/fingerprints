import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FingerprintService } from "../fingerprint.service";
import { Fingerprint } from "../shared/fingerprint";
import { ActivatedRoute } from "@angular/router";
import * as Fourier from "../shared/fourier";
import { Otsu } from "../shared/otsu";
import { toMatrix1D, toMatrix2D } from "../shared/matrix";
import { AdaptiveTreshold } from "../shared/adaptive-treshold";
import { createImageToGrayScale} from "../shared/images";
import { histogram, equalize } from "../shared/histogram";
import { Blur } from "../shared/filters/blur";
import { scaleUp2D, invertBinary2D, invertGrayScale2D, intersect } from "../shared/filters/mathematic-operations";
import { Skeletization } from "../shared/skeletization";
import { CannyEdgeDetector } from "../shared/filters/canny-edge-detector";
import { ComponentFinder } from '../shared/component-finder';
import { FilterSequence } from '../shared/filters/filter-sequence';
import { CallbackFilter } from '../shared/filters/callback-filter';

@Component({
  selector: 'app-fingerprint',
  templateUrl: './fingerprint.component.html',
  styleUrls: ['./fingerprint.component.css']
})
export class FingerprintComponent implements OnInit {

  @ViewChild("container") container: ElementRef;

  fingerprint: Fingerprint;
  fingerprintLoaded: boolean = false;

  constructor(private _fingerprintService: FingerprintService, private _route: ActivatedRoute) {}

  private _addImage(buffer: Array<Uint8Array>, label: string = undefined): HTMLCanvasElement {
    const width = this.fingerprint.tiff.width;
    const height = this.fingerprint.tiff.height;
    const container = document.createElement('div');
    container.classList.add('col');
    if (label) {
      const div = document.createElement('div');
      div.innerHTML = label;
      this.container.nativeElement.appendChild(div);
      container.appendChild(div);
    }
    const image = createImageToGrayScale(width, height, toMatrix1D(width, height, buffer));
    container.appendChild(image);

    this.container.nativeElement.appendChild(container);
    return image;
  }

  ngOnInit() {
    const name = this._route.snapshot.paramMap.get('name');
    this._fingerprintService.getByIndex(name)
        .then(fingerprint => {
          this.fingerprint = fingerprint;
          this.fingerprintLoaded = true;
        });
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
    console.log(tresholdedBuffer);
    this._addImage(toMatrix2D(width, height, tresholdedBuffer), "Otsu");

    // const eq = equalize(buffer);
    // const eqOtsu = new Otsu(eq, 2);
    // const eqTresholdedBuffer = eqOtsu.getbuffer(eq);
    // const eqOtsuImage = createImageToGrayScale(width, height, eqTresholdedBuffer);
    // this.container.nativeElement.appendChild(eqOtsuImage);
  }

  handleAdaptiveThreshold() {
    const buffer = this.fingerprint.grayBuffer2D;
    const blur = new Blur();
    const blured = blur.applyFilter(buffer);
    this._addImage(blured, blur.filterName());

    const sequence = new FilterSequence([
      new AdaptiveTreshold(),
      new CallbackFilter(invertBinary2D, "inversion"),
      new Skeletization(),
    ], (filterName, img) => {
      this._addImage(scaleUp2D(img), filterName);
    });
    const skeletized = sequence.applyFilter(blured);

    const finder = new ComponentFinder();
    const result = finder.findComponents(skeletized);
    const skeletizedImage = this._addImage(scaleUp2D(skeletized), 'Nalezené vidlice');
    const ctx: CanvasRenderingContext2D = skeletizedImage.getContext("2d");
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 0.5;
    result.forEach(value => {
      ctx.strokeRect(value.x - 3, value.y - 3, 5, 5);
    });
  }

  handleCanny() {
    const buffer = this.fingerprint.grayBuffer2D;



    const blur = new Blur();
    const blurred = blur.applyFilter(buffer);
	//
    const canny = new CannyEdgeDetector();
    const cannyEdges = canny.applyFilter(blurred);
    // this._addImage(cannyEdges, 'canny edges');
    const cannyEdgesInverted = invertGrayScale2D(cannyEdges);
    this._addImage(cannyEdgesInverted, 'canny inverted');
    const threshold = new AdaptiveTreshold();
    const thresholded = threshold.applyFilter(cannyEdgesInverted);
    this._addImage(scaleUp2D(thresholded), 'thresholded');
    // const thresholdedInverted = invertBinary2D(thresholded);
    // this._addImage(scaleUp2D(thresholdedInverted), 'thresholded inverted');
    const intersected = intersect(scaleUp2D(thresholded), blurred);
    this._addImage(intersected, 'intersected');
    // const thresholded2 = threshold.applyFilter(intersected);
    // this._addImage(scaleUp2D(thresholded2), 'thresholded2');

    const inverted = invertGrayScale2D(intersected);
    this._addImage(scaleUp2D(inverted), 'inverted');

    const thresholded2 = threshold.applyFilter(inverted);
    this._addImage(scaleUp2D(thresholded2), 'thresholded2');

    const invertedThreshold = invertBinary2D(thresholded2);
    this._addImage(scaleUp2D(invertedThreshold), 'inverted threshold');

    const skeletization = new Skeletization();
    const skeletized = skeletization.applyFilter(invertedThreshold);
    this._addImage(scaleUp2D(skeletized), 'skeletized');


  }
}
