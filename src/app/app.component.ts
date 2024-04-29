import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {TraineeService} from "./services/trainee.service";
import {Store} from "@ngrx/store";
import {TraineesAction} from "./store/actions-types";
import {MenuComponent} from "./components/menu/menu/menu.component";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {Observable} from "rxjs";
import {getLoadingState} from "./store/selectors";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MenuComponent, MatProgressSpinnerModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  onLoad$!: Observable<boolean>;

  constructor(
    private traineeService: TraineeService,
    private store: Store) {
    this.store.dispatch(TraineesAction.loadTrainees());
  }

  ngOnInit(): void {
    this.traineeService.fetchData().subscribe();
    this.onLoad$ = this.store.select(getLoadingState)
  }

}
