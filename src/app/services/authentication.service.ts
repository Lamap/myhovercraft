import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/index';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public user$: Observable<firebase.User>;

  constructor(private afAuth: AngularFireAuth) {
    this.user$ = this.afAuth.authState;
  }

  logIn(email: string, psw: string) {
      this.afAuth.auth.signInWithEmailAndPassword(email, psw)
          .then(success => console.log('Logged in'))
          .catch(error => console.warn('Failed to authenticate:', error));
  }

  logOut() {
      this.afAuth.auth.signOut()
          .then(success => {
              console.log('logged out');
          })
          .catch(error => console.warn('Failed to log out:', error));
  }
}
