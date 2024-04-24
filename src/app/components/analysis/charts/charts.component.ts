import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DragDropModule} from "@angular/cdk/drag-drop";
import {ChartComponent} from "./chart/chart.component";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-charts-container',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    ChartComponent,
    MatButtonModule
  ],
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent {
  charts = [
    {
      type: 'chart 1', description: 'Grades average over time for students with ID:', id: 1, data: [
        {
          "name": "Data 1",
          "value": 89
        },
        {
          "name": "Data 2",
          "value": 50
        },
        {
          "name": "Data 3",
          "value": 72
        }
      ]
    },
    {
      type: 'chart 2', description: 'Grades average per subject', data: [
        {
          "name": "Data 4",
          "value": 89
        },
        {
          "name": "Data 5",
          "value": 50
        },
        {
          "name": "Data 6",
          "value": 72
        }
      ]
    },

  ];

  button = {
    type: 'chart 3', description: 'Grades average for students with chosen ID', data: [
      {
        "name": "Data 7",
        "value": 89
      },
      {
        "name": "Data 8",
        "value": 50
      },
      {
        "name": "Data 9",
        "value": 72
      }
    ]
  };

  draggedItem: any;

  trackByFn(_index: any, item: any) {
    return item.id;
  }

  draggedIsButton: boolean = false;

  dragStart(_event: any, item: any, isButton: boolean = false) {
    this.draggedItem = item;
    this.draggedIsButton = isButton;
  }
  dragOver(event: any) {
    event.preventDefault();
  }

  drop(event: any, targetChart: any) {
    event.preventDefault();

    if(this.draggedIsButton) {
      // If the dragged item is button, swap target chart with the button
      const targetIndex = this.charts.findIndex(chart => chart === targetChart);
      if(targetIndex !== -1){
        const tempChart = {...this.charts[targetIndex]};
        this.charts[targetIndex] = {...this.draggedItem};
        this.button = tempChart;
      }
    } else {
      // If dragged item is another chart, swap them
      const draggedIndex = this.charts.findIndex(chart => chart === this.draggedItem);
      const targetIndex = this.charts.findIndex(chart => chart === targetChart);
      if (draggedIndex !== -1 && targetIndex !== -1) {
        [this.charts[draggedIndex], this.charts[targetIndex]] = [this.charts[targetIndex], this.charts[draggedIndex]];
      }
    }

    // reset variables
    this.draggedItem = null;
    this.draggedIsButton = false;
  }
}
