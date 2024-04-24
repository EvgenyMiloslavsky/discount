import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ChartComponent} from "../analysis/charts/chart/chart.component";

@Component({
  selector: 'app-my-test',
  standalone: true,
  imports: [CommonModule, ChartComponent],
  templateUrl: './my-test.component.html',
  styleUrls: ['./my-test.component.scss']
})
export class MyTestComponent {
  charts = [
    { type: 'chart1', id: 1, data: 'Original Chart 1 Data' },
    { type: 'chart2', id: 2, data: 'Original Chart 2 Data' },

  ];

  button = { type: 'chart3', id: 2, data: 'Original Chart 3 Data' };

  draggedItem;

  trackByFn(index, item) {
    return item.id;
  }

  dragStart(event, item) {
    this.draggedItem = item;
  }

  dragOver(event) {
    event.preventDefault();
  }

  drop(event, chart) {
    if (this.draggedItem ) {
      let tempData = chart.data;
      chart.data = this.draggedItem.data;
      this.draggedItem.data = tempData;
    }
    this.draggedItem = null;  // reset draggedItem
  }

  /*deleteChart(chart) {
    const index = this.charts.indexOf(chart);

    if (index > -1) {
      this.charts.splice(index, 1);
      this.charts = [...this.charts];  // reinitializing array to trigger Angular's change detection
    }
  }*/
}


