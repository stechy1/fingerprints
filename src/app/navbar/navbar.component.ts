import { Component } from '@angular/core';
import { AngularFireLiteAuth } from 'angularfire-lite';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  showNavbar: boolean = false;
  authenticated: boolean = false;

  constructor(public auth: AngularFireLiteAuth) {
    auth.isAuthenticated().subscribe(state => {
      this.authenticated = state;
    });
  }
}
