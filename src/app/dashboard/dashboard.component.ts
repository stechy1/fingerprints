import { Component, OnDestroy, OnInit } from '@angular/core';
import { MyTiff } from "../shared/my-tiff";
import { FingerprintService } from "../fingerprint.service";
import { Subscription } from "rxjs/Subscription";

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

}
