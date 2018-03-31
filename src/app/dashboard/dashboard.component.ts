import { Component, OnInit } from '@angular/core';
import { FingerprintService } from "../fingerprint.service";
import { Observable } from "rxjs/Observable";
import { Fingerprint } from "../shared/fingerprint";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  fingerprints$: Observable<Fingerprint[]>;

  constructor(private _fingerprintService: FingerprintService) {}

  ngOnInit() {
    this.fingerprints$ = this._fingerprintService.fingerprints();
  }

}
