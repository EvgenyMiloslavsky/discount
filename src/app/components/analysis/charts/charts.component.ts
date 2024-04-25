import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DragDropModule} from "@angular/cdk/drag-drop";
import {ChartComponent} from "./chart/chart.component";
import {MatButtonModule} from "@angular/material/button";
import {SearchService} from "../../../services/search.service";
import {filter, map, Observable, Subscription, tap} from "rxjs";
import {Trainee} from "../../../models/trainee";

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
  charts = [
    {
      type: 'chart 1', description: 'Grades average over time for students with ID', id: 1, data: [
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
      type: 'chart 2', description: 'Grades average per subject', data: []
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

  traineeById$: Observable<Trainee[] | null>;
  traineeBySubject$: Observable<Trainee[] | null>;
  draggedIsButton: boolean = false;
  subscribers: Subscription[] = [];

  constructor(private searchService: SearchService,) {
    this.traineeById$ = this.searchService.traineesById$
    this.traineeBySubject$ = this.searchService.traineesBySubject$
  }

  public ngOnInit(): void {
    this.subscribers.push(
      this.traineeBySubject$.pipe(
        tap(data => {
          if (!data) {
            const chartObject = this.charts.find(chart => chart.type === 'chart 2');
            chartObject.data = [];
          }
        }),
        filter((data): data is Trainee[] => data !== null),
        map((data: Trainee[]) => {
          return data.map(trainee => {
            const {name, subject} = trainee;
            return {
              name: `${name} ${subject}`,
              value: trainee.grade
            };
          });
        })
      ).subscribe(chartData => {
        const chartObject = this.charts.find(chart => chart.type === 'chart 2');
        if (chartObject) {
          chartObject.data = chartData;
        }
      })
    );

    this.subscribers.push(
      this.traineeById$.pipe(
        tap(data => {
          console.log("ID", data)
          if (!data) {
            const chartObject = this.charts.find(chart => chart.type === 'chart 2');
            chartObject.data = [];
          }
        }),
        filter((data): data is Trainee[] => data !== null),
        map((data: Trainee[]) => {
          return data.map(trainee => {
            const {name, subject} = trainee;
            return {
              name: `${name} ${subject}`,
              value: trainee.grade
            };
          });
        })
      ).subscribe(chartData => {
       /* const chartObject = this.charts.find(chart => chart.type === 'chart 2');
        if (chartObject) {
          chartObject.data = chartData;
        }*/
        console.log("ID Data", chartData);
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
