import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'hvr-file-selector',
  templateUrl: './file-selector.component.html',
  styleUrls: ['./file-selector.component.less']
})
export class FileSelectorComponent implements OnInit {

    @ViewChild('fileupload') fileInput;
    @Output() fileSelected$ = new EventEmitter<File>();

    public tempLoadedFile;
    private selectedFile: File;

    constructor() {}

    ngOnInit() {
    }

    browseFiles() {
        this.fileInput.nativeElement.click();
    }

    fileAdded($event) {
        console.log($event.target.files);
        this.selectedFile = $event.target.files.item(0);
        const errors: string[] = [];
        const uploads: File[] = [];

        for (let i = 0; i < $event.target.files.length; i++) {
            const file = $event.target.files[i];
            const isInvalid = this.isInvalid(file);
            if (isInvalid) {
                errors.push(isInvalid);
            } else {
                uploads.push(file);
                const reader = new FileReader();
                reader.readAsDataURL(this.selectedFile);
                reader.onload = (event) => {
                    this.tempLoadedFile = (<any>event.target).result;
                    this.fileSelected$.emit(file);
                };
            }
        }
    }

    isInvalid(file: File) {
        if (!file.type.match('image\/.*jpg|image\/.*jpeg|image\/.*png|image\/.*gif')) {
            return 'The supported image formats are: jpg, jpeg, png and gif';
        }
        if (file.size > 350000) {
            return 'The maximum image size is 300 kb';
        }
        return false;
    }

}
