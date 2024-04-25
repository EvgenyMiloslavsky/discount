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

  searchIdControl: FormControl = new FormControl('9592396 6214697 5431799 1301038');
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
          let nameArray = this.separateToArray(query);
          let mappedArray = nameArray.map(sub => {
            if (sub) {
              return sub[0].toUpperCase() + sub.slice(1);
            } else {
              return null;
            }
          });
          if (mappedArray.length === 1 && mappedArray[0] === null) {
            return of([]);
          }
          return of(mappedArray.filter(item => item != null));
        } else {
          return of([]);
        }
      })
    ).subscribe((idArray: string[] | null) => {
      this.search.searchSubjectById(idArray)
    });

    this.searchSubjectControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(query => {
        if (query !== '') {
          let nameArray = this.separateToArray(query);
          let mappedArray = nameArray.map(sub => {
            if (sub) {
              return sub[0].toUpperCase() + sub.slice(1);
            } else {
              return null;
            }
          });

          if (mappedArray.length === 1 && mappedArray[0] === null) {
            return of([]);
          }
          return of(mappedArray.filter(item => item != null));
        } else {
          return of([]);
        }
      })
    ).subscribe((nameArray: string[] | [null]) => {
      this.search.searchSubjectBySubjectName(nameArray);
    })
  }

  doSearchById(option: string[]): Observable<Trainee[] | null> {
    return this.store.select(selectTraineeByOptions('id', option));
  }

  ngOnDestroy(): void {
    // this.subscription.unsubscribe();
  }

  private separateToArray(query: string): string[] {
    return query.split(/[\s,]+/);
  }
}


