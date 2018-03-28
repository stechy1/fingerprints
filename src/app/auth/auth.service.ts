import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { User } from './user';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { map } from 'rxjs/operators/map';
import * as firebase from 'firebase';
import { Router } from '@angular/router';

const ANNONYMOUS_USER: User = {
  id: '',
  email: '',
  name: ''
}

@Injectable()
export class AuthService {

  private _userSubject = new BehaviorSubject(undefined);

  user$: Observable<User> = this._userSubject.asObservable().filter(user => !!user);
  isLoggedIn$: Observable<boolean> = this.user$.map(user => !!user.id);
  isLoggedOut$: Observable<boolean> = this.isLoggedIn$.map(value => !value);

  constructor(private _router: Router) {}

  public registerAuthHandler() {
    firebase.auth().onAuthStateChanged(a => {
      if (!a) {
        this._userSubject.next(ANNONYMOUS_USER);
        return;
      }
      this._userSubject.next({
        id: a.uid,
        email: a.email,
        name: a.displayName
      });
    });
  }

  public async signUp(name: string, email: string, password: string): Promise<any> {
    return firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(async () => {
        await firebase.auth().currentUser.updateProfile({displayName: name, photoURL: null});
        await this._router.navigate(["/upload"]);
      });
  }

  public signIn(email: string, password: string): Promise<any> {
    return firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        this._router.navigate(["/upload"]);
      });
  }

  public async logout() {
    await firebase.auth().signOut();
    await this._router.navigate(["/auth/signin"]);
  }

}
