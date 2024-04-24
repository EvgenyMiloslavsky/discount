import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {debounceTime, distinctUntilChanged, Observable, of, Subscription, switchMap} from "rxjs";
import {Store} from "@ngrx/store";
import {MatDialog} from "@angular/material/dialog";
import {SearchService} from "../../../services/search.service";
import {TraineeService} from "../../../services/trainee.service";
import {getFilter, getTraineeId} from "../../../store/selectors";
import {setFilter} from "../../../store/actions";

@Component({
  selector: 'app-filter-chart',
  standalone: true,
    imports: [CommonModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './filter-chart.component.html',
  styleUrls: ['./filter-chart.component.scss']
})
export class FilterChartComponent implements OnInit, OnDestroy {

  subscription!: Subscription;
  onDisable = true
  currentTraineeId = '';
  prefixAndNumber = ''


  searchControl = new FormControl();
  searchResults$!: Observable<any>;
  filter$: Observable<string>;
  viewButton$: Observable<boolean>;

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private search: SearchService,
    private traineeService: TraineeService
  ) {
    this.viewButton$ = this.traineeService.viewButton$;

    this.subscription = store.select(getTraineeId).subscribe(tr => {
      if (tr) {
        this.currentTraineeId = tr;
        this.onDisable = false;
      } else {
        this.currentTraineeId = '';
        this.onDisable = true;
      }
    })

    this.filter$ = store.select(getFilter);

    this.searchControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(query => {
        debugger
        console.log("Query", query);
        if (query !== '') {
          // console.log("Query", query != 'id');
          return this.doSearch(query)
        } else {
          this.store.dispatch(setFilter({filter: ''}))
          return of(null)
        }
      })
    ).subscribe(() => {
    });

  }

  ngOnInit(): void {
    this.subscription = this.filter$.subscribe(
      filter => this.searchControl.setValue(filter)
    );
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  doSearch(query: string): Observable<any> {
    console.log("DoSearch")
    const prefix = this.search.getPrefix(query);
    if (prefix === 'id') {
      const num = this.search.extractNumberFromString(query);
      this.prefixAndNumber = `${prefix}:${num}`;
      this.store.dispatch(setFilter({filter: num ? this.prefixAndNumber : 'id'}))
    } else if (prefix === 'date') {
      debugger
      const date = this.search.extractRangeDateFromString(query);
      this.prefixAndNumber = `${prefix}:${date}`;
      this.store.dispatch(setFilter({filter: date ? this.prefixAndNumber : 'date'}))
      console.log("DATE", prefix)
    } else if (prefix === 'grade') {
      const ran = this.search.extractRangeFromString(query);
      this.prefixAndNumber = `${prefix}:${ran}`;
      this.store.dispatch(setFilter({filter: ran ? this.prefixAndNumber : 'grade'}))
      console.log("GRADE", prefix)
    }
    return of(null);
  }

  updateDetails() {
    this.traineeService.onUpdateButton();
  }
}


