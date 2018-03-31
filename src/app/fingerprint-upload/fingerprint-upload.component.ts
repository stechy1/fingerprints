import { Component, OnInit } from '@angular/core';
import { MyTiff } from "../shared/my-tiff";
import { FingerprintService } from "../fingerprint.service";
import { Router } from "@angular/router";
import { Fingerprint } from "../shared/fingerprint";

@Component({
  selector: 'app-fingerprint-upload',
  templateUrl: './fingerprint-upload.component.html',
  styleUrls: ['./fingerprint-upload.component.css']
})
export class FingerprintUploadComponent implements OnInit {

  selectedFingerprint: Fingerprint;

  constructor(private _fingerprintService: FingerprintService, private _router: Router) { }

  private uploadProgress(progress: number) {
    console.log(progress);
  }

  ngOnInit() {}

  handleFileChange(event): void {
    const file: File = event.file;
    if (file) {
      this._fingerprintService.load(file)
        .then(buffer => {
          this.selectedFingerprint = Fingerprint.fromBuffer(file.name, buffer);
        }).catch(err => {
          console.log(err);
      })
    }
  }

  handleUpload() {
    this._fingerprintService.insert(this.selectedFingerprint, this.uploadProgress)
      .then(() => this._router.navigate(['dashboard']));
    //this._router.navigate(['dashboard']);
  }
}
