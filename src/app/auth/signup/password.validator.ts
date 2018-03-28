import { FormGroup, ValidationErrors } from '@angular/forms';

export class PasswordValidator {

  static same(control: FormGroup): ValidationErrors|null {
    if (!control.parent) {
      return null;
    }
    let password = control.parent.get('password').value; // to get value in input tag
    let confirmPassword = control.value; // to get value in input tag
    return (password === confirmPassword) ? null : {'passwordNotSame': true};
  }

}
