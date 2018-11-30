import {EventEmitter, Injectable} from '@angular/core';
import {BehaviorSubject, Observable, forkJoin, combineLatest} from 'rxjs/index';
import * as firebase from 'firebase';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { map, switchMap, mapTo, filter } from 'rxjs/internal/operators';

export interface ImageData {
  url: string;
  id?: string;
  tags?: string[];
  filePath: string;
  originalName: string;
}

export interface ImageQuery {
    limit: number;
    tags: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ImageCrudService {

  public taskProgress = 0;
  public imageList$: Observable<ImageData[]>;

  private storageRef;
  private basePath = 'hvr';
  private imagesFBCollectionRef: AngularFirestoreCollection<ImageData>;

  public query$ = new BehaviorSubject<ImageQuery | null>({
      limit: 20,
      tags: []
  });

  private images: ImageData[];
  public imagesWrapped = new EventEmitter<ImageData[]>();

  constructor(private store: AngularFirestore) {
      this.storageRef = firebase.storage().ref();

      this.imagesFBCollectionRef = store.collection<ImageData>('images');

      this.imageList$ = this.imagesFBCollectionRef.snapshotChanges().pipe(map(changes => {
          console.log('q: ', this.query$.getValue());
          return changes.map(change => {
             const data = change.payload.doc.data() as ImageData;
             //console.log(data);
             data.id = change.payload.doc.id;
             return data;
          });
      }));
      this.imageList$.subscribe(images => {
          this.images = images;
          if (!this.images) {
              return;
          }
          this.imagesWrapped.emit(this.images.filter(this.filterImage));
      });
/*
      this.query$.pipe(map(q => {
          return this.imagesFBCollectionRef.snapshotChanges();
      })).subscribe(q => console.log(q));
      */
      this.query$.subscribe(q => {
         console.log('i:', this.images);
          if (!this.images) {
              return;
          }
         this.imagesWrapped.emit(this.images.filter(this.filterImage));
      });

      this.imagesWrapped.subscribe(a => console.log('AAAA:' , a));
  }

  filterImage = (image) => {
      console.log('filter::', this.query$.getValue())
      return image.id === '4xUCUGpNzbQv6z5ihJcK';
  }

  public upload(file: File) {
      console.log('upload', file);

      const origFileName = file.name;
      const fileName = 'spg-' + (new Date()).getTime().toString();
      const filePath = `${this.basePath}/${fileName}`;
      const uploadTask = this.storageRef.child(filePath).put(file);

      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
          snapshot => {
              // in progress
              const snap = snapshot as firebase.storage.UploadTaskSnapshot;
              this.taskProgress = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
              console.log(this.taskProgress + '%');
          },
          error => {
              // error
              console.warn('Image upload failed:', error);
          },
          () => {
              // completed successfully
              this.storageRef.child(filePath).getDownloadURL().then(url => {
                  this.createNewImageData(url, origFileName, filePath);
              });
          });
  }

    createNewImageData(url: string, originalName: string, filePath: string) {
        const newItem: ImageData = {
            url: url,
            filePath: filePath,
            originalName: originalName
        };
        // TODO: handler error
        this.imagesFBCollectionRef.add(newItem).then(doc => {
            newItem.id = doc.id;
        });
    }

    delete(image: ImageData) {
        if (!image.filePath && !image.id) {
            return;
        }
        this.storageRef.child(image.filePath).delete()
            .then(success => {
                this.deleteFromDb(image);
            })
            .catch(error => {
                console.warn('Image delete failed:', error);
            });
    }

    deleteFromDb(image: ImageData) {
        this.imagesFBCollectionRef.doc(image.id).delete()
            .then(() => {
                console.log('Image deleted');
            })
            .catch(error => {
                console.warn('Failed to delete: ', error);
            });
    }
}
