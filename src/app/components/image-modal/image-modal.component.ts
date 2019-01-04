import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ImgEditDialogComponent } from '../img-edit-dialog/img-edit-dialog.component';

@Component({
  selector: 'hvr-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.less']
})
export class ImageModalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ImgEditDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {image: ImageData}) { }

  ngOnInit() {
  }

}
