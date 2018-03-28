import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { environment } from '../environments/environment';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private _auth: AuthService) {}

  ngOnInit(): void {
    firebase.initializeApp(environment.firebase);
    this._auth.registerAuthHandler();
  }
}
