import { Component, OnInit } from '@angular/core';
import { MyTiff } from "../shared/my-tiff";
import { FingerprintService } from "../fingerprint.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-fingerprint-upload',
  templateUrl: './fingerprint-upload.component.html',
  styleUrls: ['./fingerprint-upload.component.css']
})
export class FingerprintUploadComponent implements OnInit {

  selectedFingerprint: MyTiff;

  constructor(private _fingerprintService: FingerprintService, private _router: Router) { }

  ngOnInit() {}

  handleFileChange(event): void {
    const file = event.file;
    if (file) {
      this._fingerprintService.load(file)
        .then(value => {
          this.selectedFingerprint = value;
          console.log(value.buffer);
          console.log(value.readRGBAImage());
        }).catch(err => {
          console.log(err);
      })
    }
  }

  handleUpload() {
    this._fingerprintService.insert(this.selectedFingerprint);
    //this._router.navigate(['dashboard']);
  }
}
