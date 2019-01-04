import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin, combineLatest } from 'rxjs/index';
import * as firebase from 'firebase';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { map, switchMap, mapTo, filter } from 'rxjs/internal/operators';
import {forEach} from "@angular/router/src/utils/collection";

export interface ImageData {
  url: string;
  id?: string;
  tags?: string[];
  filePath: string;
  originalName: string;
  selected?: boolean;
}

export interface ImageQuery {
    limit: number;
    tags: string[];
}

interface ITagObject {
    value: string;
}

@Injectable({
  providedIn: 'root'
})
export class ImageCrudService {

  private storageRef;
  private basePath = 'hvr';
  private imagesFBCollectionRef: AngularFirestoreCollection<ImageData>;
  private tagsFBCollectionRef: AngularFirestoreCollection<ITagObject>;
  private images: ImageData[];
  private currentTagList: string[] = [];

  public defaultImageLimit = 20;
  public taskProgress = 0;
  public imageList$: Observable<ImageData[]>;
  public imagesWrapped$ = new EventEmitter<ImageData[]>();

  public tagList$: Observable<string[]>;
  public query$ = new BehaviorSubject<ImageQuery | null>({
      limit: this.defaultImageLimit,
      tags: []
  });

  constructor(private store: AngularFirestore) {
      this.storageRef = firebase.storage().ref();

      this.tagsFBCollectionRef = store.collection<ITagObject>('tags', ref => ref.orderBy('value', 'asc'));
      this.tagList$ = this.tagsFBCollectionRef.valueChanges().pipe(map(tags => tags.map(tag => (<ITagObject>tag).value)));
      this.tagList$.subscribe(tags => {
         this.currentTagList = tags;
      });

      this.imagesFBCollectionRef = store.collection<ImageData>('images', ref => ref.orderBy('filePath', 'desc'));
      this.imageList$ = this.imagesFBCollectionRef.snapshotChanges().pipe(map(changes => {
          return changes.map(change => {
             const data = change.payload.doc.data() as ImageData;
             data.tags = data.tags instanceof Array ? data.tags : [];
             data.id = change.payload.doc.id;
             return data;
          });
      }));
      this.imageList$.subscribe(images => {
          this.images = images;
          if (!this.images) {
              return;
          }
          this.imagesWrapped$.emit(this.queryList(this.images));
      });

      this.query$.subscribe(querySnapshot => {
          if (!this.images) {
              return;
          }
         this.imagesWrapped$.emit(this.queryList(this.images));
      });
  }

  queryList(images: ImageData[]) {
      const querySnapshot: ImageQuery = this.query$.getValue();
      // TODO: include filtering so use the same querysnapshot
      if (!querySnapshot.tags.length) {
          return images.slice(0, querySnapshot.limit);
      }
      return images.filter(this.filterImage).slice(0, querySnapshot.limit);
  }

  filterImage = (image) => {
      const query: ImageQuery = this.query$.getValue();
      if (!query.tags.length) {
          return true;
      }

      if (!image.tags) {
          return false;
      }
      for (const tag of query.tags) {
          if (image.tags.indexOf(tag) === -1) {
              return false;
          }
      }

      return true;
  }

  public upload(file: File) {
      this.uploadOne(file);
  }

  public uploadOne(file: File) {
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

    deleteImage(image: ImageData) {
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

    addNewTag(image: ImageData, tag: string) {
        this.tagsFBCollectionRef.add({
            value: tag
        }).then(doc => {
            console.log('newTag is saved');
            this.addTagToImage(image, tag);
        });
    }

    addTagToImage(image: ImageData, tag: string) {
      if (!(image.tags instanceof Array)) {
          image.tags = [];
      }
      image.tags.push(tag);
      this.imagesFBCollectionRef.doc(image.id).update({tags: image.tags});
    }

    addTagToMultipleImages(images: ImageData[], tags: string[]) {
      console.log(images, tags);
      images.forEach(image => {
         const tagsToAdd = tags.filter(tag => image.tags.indexOf(tag) === -1);
         if (tagsToAdd.length) {
             image.tags = image.tags.concat(tagsToAdd);
             this.imagesFBCollectionRef.doc(image.id).update({tags: image.tags});
         }
      });
      const tagsToAdd = tags.filter(tag => this.currentTagList.indexOf(tag) === -1);
      if (tagsToAdd.length) {
        console.log(tagsToAdd);
        tagsToAdd.forEach(tag => {
            this.tagsFBCollectionRef.add({
                value: tag
            });
        });
      }
    }

    removeTagFromImage(image: ImageData, tag: string) {
      image.tags = image.tags.filter(imageTag => tag !== imageTag);
      this.imagesFBCollectionRef.doc(image.id).update({tags: image.tags}).then(res => console.log(res)).catch(err => console.log(err));
    }
}
