import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild} from '@angular/core';
import { ImageData } from '../../services/image-crud.service';
import { AuthenticationService } from '../../services/authentication.service';
import { FormControl } from '@angular/forms';
import {MatAutocomplete, MatAutocompleteSelectedEvent, MatDialog, MatDialogConfig} from '@angular/material';
import { Observable } from 'rxjs/index';
import { startWith, map } from 'rxjs/internal/operators';
import { ImageModalComponent } from '../image-modal/image-modal.component';

@Component({
  selector: 'hvr-imagelist-item',
  templateUrl: './imagelist-item.component.html',
  styleUrls: ['./imagelist-item.component.less']
})
export class ImagelistItemComponent implements OnInit {

  @Input() image: ImageData;
  @Input() avalaibleTags: string[];
  @Output() remove$ = new EventEmitter<VoidFunction>();
  @Output() replace$ = new EventEmitter<File>();
  @Output() addNewTag$ = new EventEmitter<string>();
  @Output() addTag$ = new EventEmitter<string>();
  @Output() removeTag$ = new EventEmitter<string>();
  @Output() toggleImage$ = new EventEmitter<VoidFunction>();
  @Output() tagSelected$ = new EventEmitter<String>();
  @Output() togglePublicState$ = new EventEmitter<VoidFunction>();

  public tagFormControl  = new FormControl();
  public filteredAllTags: string[];

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(public authService: AuthenticationService, private dialog: MatDialog) {

    this.filteredAllTags = this.avalaibleTags;
    this.tagFormControl.valueChanges.subscribe(value => {
      this.setFilteredTagList(value);
    });
  }

  ngOnInit() {
  }

  setFilteredTagList(value) {
      if (!value) {
          this.filteredAllTags = this.avalaibleTags.filter(tag => this.image.tags.indexOf(tag) === -1);
          return;
      }
      value = value.toLowerCase();
      this.filteredAllTags = this.avalaibleTags.filter(tag => {
        tag = tag.toLowerCase();
        return this.image.tags.indexOf(tag) === -1 && tag.indexOf(value) !== -1;
      });
  }

  removeMe() {
    this.remove$.emit();
  }

  replaceMe(file: File) {
    this.replace$.emit(file);
  }

  selectTag(event: MatAutocompleteSelectedEvent) {
    console.log('selectTag', event.option.value);
    this.tagInput.nativeElement.value = '';
    this.tagFormControl.setValue(null);
    this.addTag$.emit(event.option.value);
  }

  addNewTag(event) {
    const newTag = event.value.trim();
    if (!this.matAutocomplete.isOpen && newTag) {
      console.log('addnewTag', newTag);
      this.addNewTag$.emit(newTag);

      this.tagFormControl.setValue(null);
      event.input.value = '';
    }
  }

  removeTag(tag: string) {
    console.log(tag);
    this.removeTag$.emit(tag);
  }

  toggleImage() {
    this.toggleImage$.emit();
  }

  togglePublicState() {
    this.togglePublicState$.emit();
  }

  openInModal() {
    console.log('modal:', this.image);
      this.dialog.open(ImageModalComponent,
          {data: {image: this.image}} as MatDialogConfig);
  }

  onTagClicked(tag: string) {
    this.tagSelected$.emit(tag);
  }

}
