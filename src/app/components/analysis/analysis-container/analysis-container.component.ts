import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {ChartsComponent} from "../charts/charts.component";
import {FilterChartComponent} from "../filter-chart/filter-chart.component";
import {MatDialogModule} from "@angular/material/dialog";

@Component({
  selector: 'app-analysis-container',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    ChartsComponent,
    FilterChartComponent,
    MatDialogModule
  ],
  templateUrl: './analysis-container.component.html',
  styleUrls: ['./analysis-container.component.scss']
})
export class AnalysisContainerComponent {

}
