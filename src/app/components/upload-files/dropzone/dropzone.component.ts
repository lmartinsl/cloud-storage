import { Component, EventEmitter, Input, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-dropzone',
  templateUrl: './dropzone.component.html',
  styleUrls: ['./dropzone.component.scss']
})
export class DropzoneComponent implements OnInit {

  public isDraggindOver: boolean = false;
  @Output() public droppedFiles: EventEmitter<FileList> = new EventEmitter<FileList>();

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
    const files = event.dataTransfer.files
    this.droppedFiles.emit(files)
    this.isDraggindOver = false;
    this.defaultEvent(event)
  }

  private defaultEvent(event: DragEvent): void {
    event.preventDefault();
  }

}
