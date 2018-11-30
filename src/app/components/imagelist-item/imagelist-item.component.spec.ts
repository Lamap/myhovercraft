import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagelistItemComponent } from './imagelist-item.component';

describe('ImagelistItemComponent', () => {
  let component: ImagelistItemComponent;
  let fixture: ComponentFixture<ImagelistItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImagelistItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagelistItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
