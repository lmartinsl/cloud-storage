import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dropzone',
  templateUrl: './dropzone.component.html',
  styleUrls: ['./dropzone.component.scss']
})
export class DropzoneComponent implements OnInit {

  public isDraggindOver: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  public onDragOverEvent(event: DragEvent): void {
    console.log(event)
    this.isDraggindOver = true;
  }

  public onDragLeaveEvent(event: DragEvent): void {
    console.log(event)
    this.isDraggindOver = false;
  }

}
