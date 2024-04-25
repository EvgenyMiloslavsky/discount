import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {debounceTime, distinctUntilChanged, Observable, of, Subscription, switchMap} from "rxjs";
import {Store} from "@ngrx/store";
import {SearchService} from "../../../services/search.service";
import {getFilter} from "../../../store/selectors";
import {MatInputModule} from "@angular/material/input";
import {StateFilter} from "../../../store/reducers";
import {setFilter} from "../../../store/actions";

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
  filterStateId$: Observable<StateFilter>;
  filterStateSubj$: Observable<StateFilter>;
  subscribers: Subscription[] = [];
  filterNameForId = 'analysisFilterId';
  filterNameForSubj = 'analysisFilterSubj';

  constructor(
    private store: Store,
    private search: SearchService,
  ) {
    this.filterStateId$ = this.store.select(getFilter(this.filterNameForId));
    this.filterStateSubj$ = this.store.select(getFilter(this.filterNameForSubj));
  }

  ngOnInit() {
    this.subscribers.push(
      this.filterStateId$.subscribe(
        filterState => {
          if (filterState) {
            this.searchIdControl.setValue(filterState.filter)
          }
        }
      ));

    this.subscribers.push(
      this.filterStateSubj$.subscribe(
        filterState => {
          if (filterState) {
            this.searchSubjectControl.setValue(filterState.filter)
          }
        }
      ))

    this.searchIdControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(query => {
        if (query !== '') {
          let nameArray = this.separateToArray(query);
          let mappedArray = nameArray.map(sub => {
            if (sub) {
              this.store.dispatch(setFilter({name: this.filterNameForId, filter: query}))
              return sub[0].toUpperCase() + sub.slice(1);
            } else {
              return [];
            }
          });
          if (mappedArray.length === 1 && mappedArray[0] === null) {
            this.store.dispatch(setFilter({name: this.filterNameForId, filter: ''}))
            return of([]);
          }
          return of(mappedArray.filter(item => item != null));
        } else {
          this.store.dispatch(setFilter({name: this.filterNameForId, filter: ''}))
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
              this.store.dispatch(setFilter({name: this.filterNameForSubj, filter: query}))
              return sub[0].toUpperCase() + sub.slice(1);
            } else {
              return null;
            }
          });
          if (mappedArray.length === 1 && mappedArray[0] === null) {
            this.store.dispatch(setFilter({name: this.filterNameForSubj, filter: ''}))
            return of([]);
          }
          return of(mappedArray.filter(item => item != null));
        } else {
          this.store.dispatch(setFilter({name: this.filterNameForSubj, filter: ''}))
          return of([]);
        }
      })
    ).subscribe((nameArray: string[]) => {
      this.search.searchSubjectBySubjectName(nameArray);
    })
  }

  /*doSearchById(option: string[]): Observable<Trainee[] | null> {
    return this.store.select(selectTraineeByOptions('id', option));
  }*/

  private separateToArray(query: string): string[] {
    return query.split(/[\s,]+/);
  }

  ngOnDestroy(): void {
    this.subscribers.map(subscriber => subscriber.unsubscribe());
  }
}


