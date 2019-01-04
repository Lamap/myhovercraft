import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material';
import { ImageCrudService, ImageData } from '../../services/image-crud.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'hvr-img-edit-dialog',
  templateUrl: './img-edit-dialog.component.html',
  styleUrls: ['./img-edit-dialog.component.less']
})
export class ImgEditDialogComponent implements OnInit {

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  public filteredTags: string[];
  public tagFormControl  = new FormControl();
  public selectedTags: string[] = [];

  constructor(private imageService: ImageCrudService, public dialogRef: MatDialogRef<ImgEditDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {images: ImageData[], avalaibleTags: string[]}) {
      this.tagFormControl.valueChanges.subscribe(value => {
          this.setFilteredTagList(value);
      });
  }


  ngOnInit() {
  }
  selectTag(event: MatAutocompleteSelectedEvent) {
      console.log('tag filter added', event.option.value);
      this.tagInput.nativeElement.value = '';
      this.tagFormControl.setValue(null);
      const selectedTag = event.option.value;
      this.selectedTags.push(selectedTag);
  }
  removeTag(tagToRemove: string) {
      console.log(tagToRemove);
      this.selectedTags = this.selectedTags.filter(tag => tag !== tagToRemove);
  }
  setFilteredTagList(value) {
      if (!value) {
          this.filteredTags = this.data.avalaibleTags.filter(tag => this.selectedTags.indexOf(tag) === -1);
          return;
      }
      value = value.toLowerCase();
      this.filteredTags = this.data.avalaibleTags.filter(tag => {
          tag = tag.toLowerCase();
          return this.selectedTags.indexOf(tag) === -1 && tag.indexOf(value) !== -1;
      });
  }

  addNewTag(event) {
      const newTag = event.value.trim();
      if (!this.matAutocomplete.isOpen && newTag && this.selectedTags.indexOf(newTag) === -1) {
          console.log('addnewTag', newTag);

          this.selectedTags.push(newTag);

          this.tagFormControl.setValue(null);
          event.input.value = '';
      }
  }

  apply() {
    this.imageService.addTagToMultipleImages(this.data.images, this.selectedTags);
    this.dialogRef.close();
  }

  cancel() {
      this.dialogRef.close();
  }

}
