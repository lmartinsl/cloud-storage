import { FileEntry } from './../../interfaces/fileentry.interface';
import { FilesService } from './../../services/files.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.scss']
})
export class UploadFilesComponent implements OnInit {

  public files: FileEntry[] = [];

  constructor(
    private filesService: FilesService
  ) { }

  ngOnInit(): void {
  }

  /**
   *
   * @param files Refere-se à lista de itens recebidos do componente filho (dropzone)
   */
  public getFiles(files: FileList): void {
    this.files.splice(0, this.files.length)
    for (let i = 0; i < files.length; i++) {
      /**
       * O upload é feito um por vez,
       * por isso é necessário percorrer pela lista de itens
       */
      // this.filesService.uploadFile(files.item(i))

      this.files.push({
        file: files.item(i),
        percentage: null,
        uploading: null,
        bytesUploaded: null,
        canceled: null,
        error: null,
        finished: null,
        paused: null,
        state: null,
        task: null
      })
    }
  }

  public removeFileFromList(i: number): void {
    this.files.splice(i, 1)
  }

  public uploadAll(): void {
    for (let i = 0; i < this.files.length; i++) {
      this.filesService.upload(this.files[i]);
    }
  }

}
