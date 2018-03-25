import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  showNavbar: boolean = false;

  constructor() { }

  handleToggleNavbar() {
    this.showNavbar = !this.showNavbar;
  }
}
