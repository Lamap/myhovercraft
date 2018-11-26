import { Component } from '@angular/core';
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material';
import { AuthenticationService } from './services/authentication.service';
import { AuthDialogComponent, IUserAuthData } from './components/auth-dialog/auth-dialog.component';
import { Observable } from 'rxjs/index';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  public user$: Observable<firebase.User>;
  public userEmail = '';
  public userAuthData: IUserAuthData;

  private authDialogRef: MatDialogRef<AuthDialogComponent, IUserAuthData>;

  constructor (private authService: AuthenticationService, private dialog: MatDialog) {
    this.userAuthData = {
        email: null,
        password: null
    };

    this.user$ = this.authService.user$;
    this.authService.user$.subscribe(user => {
        this.userEmail = user ? user.email : '';
    });
  }

  logIn() {
    console.log('login');
      this.authDialogRef = this.dialog.open(AuthDialogComponent, {data: this.userAuthData} as MatDialogConfig);
      this.authDialogRef.afterClosed().subscribe(result => {
        if (this.userAuthData && this.userAuthData.password) {
            this.authService.logIn(this.userAuthData.email, this.userAuthData.password);
        }
      });
  }

  logOut() {
    this.authService.logOut();
  }
}
