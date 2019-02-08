import { Component, OnInit } from '@angular/core';
import { ImageCrudService, ImageData, ImageListData } from '../../services/image-crud.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Observable, fromEvent } from 'rxjs/index';

@Component({
  selector: 'hvr-imagelist',
  templateUrl: './imagelist.component.html',
  styleUrls: ['./imagelist.component.less']
})

// TODO: use this: https://k3nsei.gitbook.io/ng-in-viewport/getting-started/installation

export class ImagelistComponent implements OnInit {

  public images: ImageData[];
  public structuredImages: ImageData[][] = [];
  public availableTags: string[] = [];
  public colCount = 4;
  public colClass: string;
  public restImageCount = 0;

  private colClassBase = 'hvr-imagelist__items-col--split-';
  private imageBaseWidth = 220;

  private selectedImages: ImageData[] = [];

  constructor(private imageService: ImageCrudService, public authService: AuthenticationService) {

    this.imageService.imageListData$.subscribe( (dataSnapshot: ImageListData) => {
      this.restImageCount = dataSnapshot.total - dataSnapshot.items.length;
      this.images = dataSnapshot.items;
      this.structuredImages = this.calculateStructuredImageList(this.images);
      this.selectedImages = [];
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
      this.colCount = Math.floor(window.innerWidth / this.imageBaseWidth);
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

  replaceImage($event: File, image: ImageData) {
      console.log(image, $event);
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

  loadMore(event) {
    if (event.visible) {
        const querySnapshot = this.imageService.query$.getValue();
        querySnapshot.limit += this.colCount * 3;
        this.imageService.query$.next(querySnapshot);
    }
  }

  toggleSelection(image: ImageData) {
      console.log(image);
      image.selected = !image.selected;
      this.selectedImages = this.images.filter(item => item.selected);
  }

  clearSelection() {
      this.selectedImages.map(image => {
          return image.selected = false;
      });
      this.selectedImages = [];
  }

  tagSelected(tag: string) {
      const querySnapshot = this.imageService.query$.getValue();
      querySnapshot.tags = [tag];
      querySnapshot.limit = this.colCount * 3;
      this.imageService.query$.next(querySnapshot);
  }

  togglePublicity(image: ImageData) {
      this.imageService.setPublicState(image, !image.isPublic);
  }

}
