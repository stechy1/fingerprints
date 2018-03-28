import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { FlashMessagesService } from 'ngx-flash-messages';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  private static readonly MESSAGES = {
    "auth/wrong-password": "Uživatelské jméno nebo neslo není psrávné"
  };

  signinForm: FormGroup;

  constructor(private _auth: AuthService, private _flash: FlashMessagesService) { }

  ngOnInit() {
    this.signinForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(8)]),
    });
  }

  handleSubmit() {
    const credentials = this.signinForm.value;
    this._auth.signIn(credentials.email, credentials.password)
      .catch(err => {
        this._flash.show(SigninComponent.MESSAGES[err.code], {classes: ['alert', 'alert-danger']});
    });
  }

}
