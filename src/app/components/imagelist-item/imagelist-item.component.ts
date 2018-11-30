import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { ImageData } from '../../services/image-crud.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'hvr-imagelist-item',
  templateUrl: './imagelist-item.component.html',
  styleUrls: ['./imagelist-item.component.less']
})
export class ImagelistItemComponent implements OnInit {

  @Input() image: ImageData;
  @Output() remove$ = new EventEmitter<VoidFunction>();

  constructor(public authService: AuthenticationService) { }

  ngOnInit() {
  }

  removeMe() {
    this.remove$.emit();
  }
}
