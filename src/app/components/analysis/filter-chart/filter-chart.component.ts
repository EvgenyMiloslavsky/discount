import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {debounceTime, distinctUntilChanged, Observable, of, switchMap} from "rxjs";
import {Store} from "@ngrx/store";
import {SearchService} from "../../../services/search.service";
import {selectTraineeByOptions} from "../../../store/selectors";
import {MatInputModule} from "@angular/material/input";
import {Trainee} from "../../../models/trainee";

@Component({
  selector: 'app-filter-chart',
  standalone: true,
  imports: [CommonModule, MatButtonModule, ReactiveFormsModule, MatInputModule],
  templateUrl: './filter-chart.component.html',
  styleUrls: ['./filter-chart.component.scss']
})
export class FilterChartComponent implements OnInit, OnDestroy {

  searchIdControl: FormControl = new FormControl();
  searchSubjectControl: FormControl = new FormControl();

  constructor(
    private store: Store,
    private search: SearchService,
  ) {
  }

  ngOnInit() {
    this.searchIdControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(query => {
        if (query !== '') {
          const separatedToArray = this.separateToArray(query);
          return this.doSearchById(separatedToArray);
        } else {
          return of(null);
        }
      })
    ).subscribe((tr: Trainee[] | null) => {
      this.search.setTraineesById(tr)
    });

    this.searchSubjectControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(query => {
        if (query !== '') {
          let separatedToArray = this.separateToArray(query);
          separatedToArray = separatedToArray.map(sub => {
              if (sub) {
                return sub[0].toUpperCase() + sub.slice(1)
              }else{
                return '';
              }
            }
          )
          return this.doSearchBySubject(separatedToArray)
        } else {
          return of(null)
        }
      })
    ).subscribe((tr) => {
      this.search.setTraineesBySubject(tr)
    });
  }

  doSearchById(option: string[]): Observable<Trainee[] | null> {
    return this.store.select(selectTraineeByOptions('id', option));
  }

  doSearchBySubject(option: string[]) {
    return this.store.select(selectTraineeByOptions('subject', option));
  }

  ngOnDestroy(): void {
    // this.subscription.unsubscribe();
  }

  private separateToArray(query: string): string[] {
    return query.split(/[\s,]+/);
  }
}


