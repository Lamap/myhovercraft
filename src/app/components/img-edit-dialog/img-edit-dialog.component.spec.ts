import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgEditDialogComponent } from './img-edit-dialog.component';

describe('ImgEditDialogComponent', () => {
  let component: ImgEditDialogComponent;
  let fixture: ComponentFixture<ImgEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImgEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImgEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
