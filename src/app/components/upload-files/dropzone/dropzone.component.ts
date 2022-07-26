import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-dropzone',
  templateUrl: './dropzone.component.html',
  styleUrls: ['./dropzone.component.scss']
})
export class DropzoneComponent implements OnInit {

  public isDraggindOver: boolean = false;
  @Output() droppedFiles: EventEmitter<FileList> = new EventEmitter<FileList>();

  constructor() { }

  ngOnInit(): void {
  }

  public onDragOverEvent(event: DragEvent): void {
    this.defaultEvent(event)
    this.isDraggindOver = true;
  }

  public onDragLeaveEvent(event: DragEvent): void {
    this.defaultEvent(event)
    this.isDraggindOver = false;
  }

  public onDropEvent(event: DragEvent): void {
    this.droppedFiles.emit(event.dataTransfer.files)
    this.defaultEvent(event)
  }

  private defaultEvent(event: DragEvent): void {
    event.preventDefault();
  }

}
