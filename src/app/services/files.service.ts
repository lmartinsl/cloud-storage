import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { UploadTaskSnapshot } from '@angular/fire/storage/interfaces';
import { FileEntry } from './../interfaces/fileentry.interface';
import { catchError, finalize, map } from 'rxjs/operators'
import { from, of } from 'rxjs'
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { MyFile } from '../interfaces/myfile.interface';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  private filesCollection: AngularFirestoreCollection<MyFile>;

  constructor(
    private storage: AngularFireStorage,
    private afs: AngularFirestore
  ) {
    this.filesCollection = afs.collection('myFiles', (ref) => ref.orderBy('date', 'desc'));
  }

  // public uploadFile(f: File): void {
  //   let path = `myFiles/${f.name}`;
  //   let task = this.storage.upload(path, f);
  //   task.snapshotChanges()
  //     .subscribe((s) => console.log(s))
  // }

  public upload(f: FileEntry): void {

    let newFileName = `${(new Date()).getTime()}_${f.file.name}`;
    let path = `myFiles/${newFileName}`;
    f.task = this.storage.upload(path, f.file);
    f.state = f.task.snapshotChanges()
      .pipe(
        map((s: UploadTaskSnapshot) => f.task.task.snapshot.state),
        catchError((err) => of(f.task.task.snapshot.state))
      );
    this.fillAttributes(f);
    f.task.snapshotChanges().pipe(
      /**
       * @finalize captura o momento em que o observable é finalizado.
       */
      finalize(() => {
        console.log(f.task.task.snapshot.state)
        if (f.task.task.snapshot.state === 'success') {
          this.filesCollection.add({
            fileName: f.file.name,
            path: path,
            date: (new Date()).getTime(),
            size: f.file.size,
          })
        }
      })
    )
      .subscribe()
  }

  public fillAttributes(f: FileEntry): void {
    f.percentage = f.task.percentageChanges();
    f.uploading = f.state.pipe(map((s) => s === 'running'))
    f.finished = from(f.task).pipe(map((s) => s.state === 'success'))
    f.paused = f.state.pipe(map((s) => s === 'paused'))
    f.error = f.state.pipe(map((s) => s === 'error'))
    f.canceled = f.state.pipe(map((s) => s === 'canceled'))
    f.bytesUploaded = f.task.snapshotChanges().pipe(map((s) => s.bytesTransferred))
  }

  public getFiles(): Observable<MyFile[]> {
    return this.filesCollection.snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            console.log(a)
            const file: MyFile = a.payload.doc.data();
            const id = a.payload.doc.id;
            const url = this.storage.ref(file.path).getDownloadURL();
            return {
              id,
              ...file,
              url
            }
          })
        })
      )
  }

  public deleteFile(f: MyFile): void {
    this.storage.ref(f.path).delete();
    this.filesCollection.doc(f.id).delete();
  }
}
