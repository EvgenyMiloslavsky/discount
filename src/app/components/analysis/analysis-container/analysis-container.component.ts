import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {ChartsComponent} from "../charts/charts/charts.component";

@Component({
  selector: 'app-analysis-container',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, ChartsComponent],
  templateUrl: './analysis-container.component.html',
  styleUrls: ['./analysis-container.component.scss']
})
export class AnalysisContainerComponent {

}
