import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagelistHeaderComponent } from './imagelist-header.component';

describe('ImagelistHeaderComponent', () => {
  let component: ImagelistHeaderComponent;
  let fixture: ComponentFixture<ImagelistHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImagelistHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagelistHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
