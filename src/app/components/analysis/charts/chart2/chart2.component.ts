import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BarChartModule} from "@swimlane/ngx-charts";

@Component({
  selector: 'app-chart2',
  standalone: true,
  imports: [CommonModule, BarChartModule],
  templateUrl: './chart2.component.html',
  styleUrls: ['./chart2.component.scss']
})
export class Chart2Component {
  chartData: any[] = [
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
  ];

  view: any[] = [700, 400]; // Width and height of the chart

  // Options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Data';
  showYAxisLabel = true;
  yAxisLabel = 'Value';

  /*colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };*/
  colorScheme='vivid'
}
