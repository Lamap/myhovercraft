import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface IUserAuthData {
  email: string;
  password: string;
}

@Component({
  selector: 'hvr-auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styleUrls: ['./auth-dialog.component.less']
})
export class AuthDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AuthDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: IUserAuthData) { }

  ngOnInit() {
  }

  submit() {
    this.dialogRef.close();
  }

}
