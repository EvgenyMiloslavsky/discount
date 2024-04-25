import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DragDropModule} from "@angular/cdk/drag-drop";
import {ChartComponent} from "./chart/chart.component";
import {MatButtonModule} from "@angular/material/button";
import {SearchService, TraineeSubject} from "../../../services/search.service";
import {Observable, Subscription} from "rxjs";
import chartsAndButton from "../../../../assets/chartData.json";

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
export class ChartsComponent implements OnInit, OnDestroy {

  charts = chartsAndButton.charts;
  button = chartsAndButton.button
  draggedItem: any;

  traineeById$: Observable<TraineeSubject[] | null>;
  traineeBySubject$: Observable<TraineeSubject[] | null>;
  draggedIsButton: boolean = false;
  subscribers: Subscription[] = [];

  constructor(private searchService: SearchService,) {
    this.traineeById$ = this.searchService.traineesById$;
    this.traineeBySubject$ = this.searchService.traineesBySubject$;
  }

  public ngOnInit(): void {
    this.subscribers.push(
      this.traineeBySubject$.subscribe(chartData => {
        const chartObject = this.charts.find(chart => chart.type === 'chart 2');
        if (chartObject) {
          console.log("ID Data", chartData);
          chartObject.data = chartData;
        }
      })
    );

    this.subscribers.push(
      this.traineeById$.subscribe(chartData => {
        const chartObject = this.charts.find(chart => chart.type === 'chart 1');
        if (chartObject) {
          console.log("ID Data", chartData);
          chartObject.data = chartData;
        }
      })
    )
  }

  trackByFn(_index: any, item: any) {
    return item.id;
  }

  dragStart(_event: any, item: any, isButton: boolean = false) {
    this.draggedItem = item;
    this.draggedIsButton = isButton;
  }

  dragOver(event: any) {
    event.preventDefault();
  }

  drop(event: any, targetChart: any) {
    event.preventDefault();
    if (this.draggedIsButton) {
      // If the dragged item is button, swap target chart with the button
      const targetIndex = this.charts.findIndex(chart => chart === targetChart);
      if (targetIndex !== -1) {
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

  ngOnDestroy(): void {
    this.subscribers.map(subscriber => subscriber.unsubscribe());
  }
}
