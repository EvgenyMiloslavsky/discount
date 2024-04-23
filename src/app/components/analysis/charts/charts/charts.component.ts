import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CdkDragDrop, DragDropModule, moveItemInArray} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent {
  charts = [
    {data: 'Chart 1', isExpanded: true},
    {data: 'Chart 2', isExpanded: true},
    {data: 'Chart 3', isExpanded: false}  // initially collapsed
  ];

  drop(event: CdkDragDrop<any>) {
    moveItemInArray(this.charts, event.previousIndex, event.currentIndex);
    this.charts[event.currentIndex].isExpanded = true;
    this.charts[event.previousIndex].isExpanded = false;
  }
}
