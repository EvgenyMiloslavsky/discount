import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {TraineeService} from "./services/trainee.service";
import {Store} from "@ngrx/store";
import {TraineesAction} from "./store/actions-types";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private traineeService: TraineeService,
    private store: Store) {
  }

  ngOnInit(): void {
    this.traineeService.fetchData().subscribe(data =>
      console.log(data));

    this.store.dispatch(TraineesAction.loadTrainees());

  }

}
