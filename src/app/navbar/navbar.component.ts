import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  showNavbar: boolean = false;
  isLoggedIn$: Observable<boolean> = this._auth.isLoggedIn$;

  constructor(private _auth: AuthService) {

  }
}
