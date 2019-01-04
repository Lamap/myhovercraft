import { Component, OnInit, Input, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatDialog, MatDialogConfig } from '@angular/material';
import { FormControl } from '@angular/forms';
import { ImageCrudService, ImageData } from '../../services/image-crud.service';
import { AuthenticationService } from '../../services/authentication.service';
import { ImgEditDialogComponent } from '../img-edit-dialog/img-edit-dialog.component';

@Component({
  selector: 'hvr-imagelist-header',
  templateUrl: './imagelist-header.component.html',
  styleUrls: ['./imagelist-header.component.less']
})
export class ImagelistHeaderComponent implements OnInit {

    @Input() avalaibleTags: string[];
    @Input() selectedImages: ImageData[];

    @Output() uploadImage$ = new EventEmitter<File>();
    @Output() clearSelections$ = new EventEmitter<VoidFunction>();

    public filteredTags: string[];
    public tagFormControl  = new FormControl();

    @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto') matAutocomplete: MatAutocomplete;
    constructor(public imageService: ImageCrudService, public authService: AuthenticationService,
        private dialog: MatDialog) {
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
        const querySnapShot = this.imageService.query$.getValue();
        querySnapShot.tags.push(selectedTag);
        querySnapShot.limit = this.imageService.defaultImageLimit;
        this.imageService.query$.next(querySnapShot);
    }
    removeTag(tagToRemove: string) {
        console.log(tagToRemove);
        const querySnapShot = this.imageService.query$.getValue();
        querySnapShot.tags = querySnapShot.tags.filter(tag => tag !== tagToRemove);
        querySnapShot.limit = this.imageService.defaultImageLimit;
        this.imageService.query$.next(querySnapShot);
    }
    setFilteredTagList(value) {
        console.log(value);
        const selectedTags = this.imageService.query$.getValue().tags;
        if (!value) {
            this.filteredTags = this.avalaibleTags.filter(tag => selectedTags.indexOf(tag) === -1);
            return;
        }
        value = value.toLowerCase();
        this.filteredTags = this.avalaibleTags.filter(tag => {
            tag = tag.toLowerCase();
            return selectedTags.indexOf(tag) === -1 && tag.indexOf(value) !== -1;
        });
    }
    fileSelected(file: File) {
        console.log('file', file);
        this.uploadImage$.emit(file);
    }

    addTag() {
        console.log('add');
        this.dialog.open(ImgEditDialogComponent,
            {data: {images: this.selectedImages, avalaibleTags: this.avalaibleTags}} as MatDialogConfig);
    }

    download() {
        console.log('down');
    }

    remove() {
        console.log('remove');
    }
    clear() {
        this.clearSelections$.emit();
    }
}
