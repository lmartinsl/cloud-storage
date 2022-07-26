import { MyFile } from './../../interfaces/myfile.interface';
import { Observable } from 'rxjs';
import { FilesService } from './../../services/files.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-files',
  templateUrl: './my-files.component.html',
  styleUrls: ['./my-files.component.scss']
})
export class MyFilesComponent implements OnInit {

  public files: Observable<MyFile[]>;

  constructor(
    private filesService: FilesService
  ) { }

  ngOnInit(): void {
    this.files = this.filesService.getFiles()
  }

  public getDate(n: number): Date {
    return new Date(n)
  }

  public deleteFile(f: MyFile): void {
    this.filesService.deleteFile(f);
  }
}
