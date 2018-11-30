import { Component, OnInit } from '@angular/core';
import { ImageCrudService, ImageData } from '../../services/image-crud.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'hvr-imagelist',
  templateUrl: './imagelist.component.html',
  styleUrls: ['./imagelist.component.less']
})
export class ImagelistComponent implements OnInit {

  public images: ImageData[];
  public structuredImages: ImageData[][] = [];
  public colClass = 'hvr-imagelist__items-col--split-4';

  private colCount = 4;

  constructor(private imageService: ImageCrudService, public authService: AuthenticationService) {

    this.imageService.imageList$.subscribe(images => {
      this.images = images;

      this.structuredImages = this.calculateStructuredImageList(images);
      console.log(this.structuredImages);
    });

    this.imageService.query$.subscribe(q => console.log(q));
  }

  calculateStructuredImageList(images: ImageData[]): ImageData[][] {
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

  removeImage(image) {
    console.log(image);
    this.imageService.delete(image);
  }

}
