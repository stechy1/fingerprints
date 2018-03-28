import { Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PasswordValidator } from './password.validator';
import { AuthService } from '../auth.service';
import { FlashMessagesService } from 'ngx-flash-messages';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  private static readonly MESSAGES = {
    "auth/email-already-in-use": "Zadaný e-mail je již použitý"
  };

  signupForm: FormGroup;

  constructor(private _auth: AuthService, private _flash: FlashMessagesService) { }

  ngOnInit() {
    this.signupForm = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'passwordData': new FormGroup({
        'password': new FormControl(null, [Validators.required, Validators.minLength(8)]),
        'passwordConfirm': new FormControl(null, [Validators.required, PasswordValidator.same])
      })
    });
  }

  handleSubmit() {
    const credentials = this.signupForm.value;
    this._auth.signUp(credentials.name, credentials.email, credentials.passwordData.password)
      .catch(err => {
        this._flash.show(SignupComponent.MESSAGES[err.code], {classes: ['alert', 'alert-danger']});
      });
  }

}
