import {ChangeDetectorRef, Component, Input, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BarChartModule} from "@swimlane/ngx-charts";

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule, BarChartModule],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnDestroy{
  @Input() public chartData: any[] = [];
  @Input() public index: number = 0;

  view: any[] = [300, 300]; // Width and height of the chart

  // Options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showXAxisLabel = true;
  xAxisLabel = 'Data';
  showYAxisLabel = true;
  yAxisLabel = 'Value';

  colorScheme = 'vivid'


  constructor(private changeDetectorRef: ChangeDetectorRef) {
    this.updateChartSize();
    window.addEventListener('resize', () => this.updateChartSize());
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.updateChartSize);
  }

  updateChartSize = () => {
    this.view = [window.innerWidth / 3, window.innerHeight / 2.2];
    this.changeDetectorRef.markForCheck();
  };
}
