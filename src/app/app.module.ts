import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {
  MatAutocompleteModule,
  MatInputModule,
  MatChipsModule,
  MatCardModule,
  MatSliderModule,
  MatCheckboxModule,
  MatIconModule,
  MatDialogModule
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ImagelistComponent } from './components/imagelist/imagelist.component';
import { AuthDialogComponent } from './components/auth-dialog/auth-dialog.component';

import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileSelectorComponent } from './components/file-selector/file-selector.component';
import { ImagelistItemComponent } from './components/imagelist-item/imagelist-item.component';
import { ImagelistHeaderComponent } from './components/imagelist-header/imagelist-header.component';

@NgModule({
  declarations: [
    AppComponent,
    ImagelistComponent,
    AuthDialogComponent,
    FileSelectorComponent,
    ImagelistItemComponent,
    ImagelistHeaderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatChipsModule,
    MatCardModule,
    MatSliderModule,
    MatCheckboxModule,
    MatIconModule,
    MatDialogModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    AuthDialogComponent
  ],
})
export class AppModule { }
