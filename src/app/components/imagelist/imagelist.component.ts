import { Component, OnInit } from '@angular/core';
import { ImageCrudService, ImageData } from '../../services/image-crud.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Observable, fromEvent } from 'rxjs/index';

@Component({
  selector: 'hvr-imagelist',
  templateUrl: './imagelist.component.html',
  styleUrls: ['./imagelist.component.less']
})
export class ImagelistComponent implements OnInit {

  public images: ImageData[];
  public structuredImages: ImageData[][] = [];
  private colClassBase = 'hvr-imagelist__items-col--split-';

  public availableTags: string[] = [];
  public colCount = 4;
  public colClass: string;

  constructor(private imageService: ImageCrudService, public authService: AuthenticationService) {

    this.imageService.imagesWrapped$.subscribe(images => {
      this.images = images;

      this.structuredImages = this.calculateStructuredImageList(images);
      console.log('structureImages', this.structuredImages);
    });

    this.imageService.query$.subscribe(q => console.log(q));

    this.imageService.tagList$.subscribe(tags => {
        this.availableTags = tags;
    });

    fromEvent(window, 'resize')
        .subscribe(event => {
            this.structuredImages = this.calculateStructuredImageList(this.images);
        });
  }

  calculateStructuredImageList(images: ImageData[]): ImageData[][] {
      this.colCount = Math.floor(window.innerWidth / 300);
      this.colClass = this.colClassBase + this.colCount;
      console.log('calc', this.colCount, this.colClass);
      const structuredImages: ImageData[][] = [];
      for (let colIndex = 0; colIndex < this.colCount; colIndex++) {
          structuredImages[colIndex] = images.filter((image, imageIndex) => {
              return (imageIndex % this.colCount) === colIndex;
          });
      }
      return structuredImages;
  }

  fileSelected($event: File) {
    console.log('file selected', $event);
    this.imageService.upload($event);
  }

  ngOnInit() {
  }

  removeImage(image: ImageData) {
    console.log(image);
    this.imageService.deleteImage(image);
  }

  addNewTag(tag: string, image: ImageData) {
    this.imageService.addNewTag(image, tag);
  }

  addTag(tag: string, image: ImageData) {
    console.log(tag, image);
    this.imageService.addTagToImage(image, tag);
  }

  removeTag(tag: string, image: ImageData) {
    console.log('removeImage', tag, image);
    this.imageService.removeTagFromImage(image, tag);
  }

}
