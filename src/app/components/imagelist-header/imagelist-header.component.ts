import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material';
import { FormControl } from '@angular/forms';
import {ImageCrudService, ImageQuery} from '../../services/image-crud.service';

@Component({
  selector: 'hvr-imagelist-header',
  templateUrl: './imagelist-header.component.html',
  styleUrls: ['./imagelist-header.component.less']
})
export class ImagelistHeaderComponent implements OnInit {

    @Input() avalaibleTags: string[];

    public filteredTags: string[];
    public tagFormControl  = new FormControl();

    @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto') matAutocomplete: MatAutocomplete;
    constructor(public imageService: ImageCrudService) {
        this.tagFormControl.valueChanges.subscribe(value => {
            this.setFilteredTagList(value);
        });
    }

    ngOnInit() {
    }

    selectTag(event: MatAutocompleteSelectedEvent) {
        console.log('selectTag', event.option.value);
        this.tagInput.nativeElement.value = '';
        this.tagFormControl.setValue(null);
        const selectedTag = event.option.value;
        const querySnapShot = this.imageService.query$.getValue();
        querySnapShot.tags.push(selectedTag);
        this.imageService.query$.next(querySnapShot);
    }
    removeTag(tagToRemove: string) {
        console.log(tagToRemove);
        const querySnapShot = this.imageService.query$.getValue();
        querySnapShot.tags = querySnapShot.tags.filter(tag => tag !== tagToRemove);
        this.imageService.query$.next(querySnapShot);
    }
    setFilteredTagList(value) {
        console.log(value);
        const selectedTags = this.imageService.query$.getValue().tags;
        if (!value) {
            this.filteredTags = this.avalaibleTags.filter(tag => selectedTags.indexOf(tag) === -1);
            return;
        }
        this.filteredTags = this.avalaibleTags.filter(tag => {
            return selectedTags.indexOf(tag) === -1 && tag.indexOf(value) !== -1;
        });
    }

}
