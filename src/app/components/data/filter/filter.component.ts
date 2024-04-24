import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {Store} from "@ngrx/store";
import {debounceTime, distinctUntilChanged, Observable, of, Subscription, switchMap} from "rxjs";
import {getFilter, getTraineeId} from "../../../store/selectors";
import {removeTrainee, setFilter, setTraineeId} from "../../../store/actions";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {TraineeDialogComponent} from "../trainee-dialog/trainee-dialog.component";
import {TraineesAction} from "../../../store/actions-types";
import {Trainee} from "../../../models/trainee";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {SearchService} from "../../../services/search.service";
import {TraineeService} from "../../../services/trainee.service";

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, ReactiveFormsModule],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit, OnDestroy {

  subscription!: Subscription;
  onDisable = true
  currentTraineeId = '';
  prefixAndNumber = ''


  searchControl = new FormControl();
  filter$: Observable<string>;
  viewButton$: Observable<boolean>;

  subscribers: Subscription[] = [];

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private search: SearchService,
    private traineeService: TraineeService
  ) {
    this.viewButton$ = this.traineeService.viewButton$;

    this.subscribers.push(this.subscription = store.select(getTraineeId).subscribe(tr => {
      if (tr) {
        this.currentTraineeId = tr;
        this.onDisable = false;
      } else {
        this.currentTraineeId = '';
        this.onDisable = true;
      }
    }))

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
    this.subscribers.push(this.subscription = this.filter$.subscribe(
      filter => this.searchControl.setValue(filter)
    ))
  }

  traineeRemove() {
    this.store.dispatch(removeTrainee({id: this.currentTraineeId}));
    this.store.dispatch(setTraineeId({selectedTraineesId: ''}));
  }

  openAddTraineeDialog(): void {
    const dialogRef = this.dialog.open(TraineeDialogComponent, {
      width: '30rem',
    });

    dialogRef.afterClosed().subscribe((result: Trainee) => {
      if (result)
        this.store.dispatch(TraineesAction.addTrainee({trainee: result}));
    });
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

  ngOnDestroy(): void {
    this.subscribers.map(subscriber => subscriber.unsubscribe());
  }
}
