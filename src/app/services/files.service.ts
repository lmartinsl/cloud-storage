import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { UploadTaskSnapshot } from '@angular/fire/storage/interfaces';
import { FileEntry } from './../interfaces/fileentry.interface';
import { catchError, map } from 'rxjs/operators'
import { from, of } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  constructor(
    private storage: AngularFireStorage
  ) { }

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
}
