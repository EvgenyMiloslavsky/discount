import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {Store} from "@ngrx/store";
import {debounceTime, distinctUntilChanged, Observable, of, Subscription, switchMap} from "rxjs";
import {getFilter, getTrainee} from "../../../store/selectors";
import {removeTrainee, setFilter, setTraineeId} from "../../../store/actions";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {TraineeDialogComponent} from "../trainee-dialog/trainee-dialog.component";
import {TraineesAction} from "../../../store/actions-types";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {SearchService} from "../../../services/search.service";
import {TraineeService} from "../../../services/trainee.service";
import {StateFilter} from "../../../store/reducers";

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
  currentTrainee = '';
  currentTraineeSubject = '';
  prefixAndNumber = ''


  searchControl = new FormControl();
  filter$: Observable<StateFilter>;
  viewButton$: Observable<boolean>;

  subscribers: Subscription[] = [];

  filterName = 'dataFilter';

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private search: SearchService,
    private traineeService: TraineeService
  ) {
    this.viewButton$ = this.traineeService.viewButton$;

    this.subscribers.push(
      this.subscription = store.select(getTrainee).subscribe(tr => {
        console.log("SEL", tr)
        if (tr) {
          this.currentTrainee = tr['id'];
          this.currentTraineeSubject = tr['subject'];
          this.onDisable = false;
        } else {
          this.currentTrainee = '';
          this.currentTraineeSubject = '';
          this.onDisable = true;
        }
      }))

    this.filter$ = store.select(getFilter(this.filterName));

    this.searchControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(query => {
        if (query !== '' && query !== undefined) {
          return this.doSearch(query)
        } else {
          this.store.dispatch(setFilter({name: this.filterName, filter: ''}))
          return of(null)
        }
      })
    ).subscribe(() => {
    });

  }

  ngOnInit(): void {
    this.subscribers.push(
      this.filter$.subscribe(
        filterState => {
          if (filterState) {
            this.searchControl.setValue(filterState.filter)
          }
        }
      ))
  }

  traineeRemove() {
    this.store.dispatch(removeTrainee({id: this.currentTrainee, subject: this.currentTraineeSubject}));
    this.store.dispatch(setTraineeId({selectedTraineesId: '', subject: ''}));
  }

  openAddTraineeDialog(): void {
    const dialogRef = this.dialog.open(TraineeDialogComponent, {
      width: '30rem',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        const trainee = {
          id: result.id, address: result.address,
          city: result.city, zip: result.zip,
          name: result.name, country: result.country,
          email: result.email, date_joined: result.date_joined,
          subjects: [{name: result.subject, grade: result.grade}]
        };
        this.store.dispatch(TraineesAction.addTrainee({trainee: trainee}));
      }
    });
  }

  doSearch(query: string): Observable<any> {
    const prefix = this.search.getPrefix(query);
    if (prefix === 'id') {
      const num = this.search.extractNumberFromString(query);
      this.prefixAndNumber = `${prefix}:${num}`;
      this.store.dispatch(setFilter({name: this.filterName, filter: num ? this.prefixAndNumber : 'id'}))
    } else if (prefix === 'date') {
      const date = this.search.extractRangeDateFromString(query);
      this.prefixAndNumber = `${prefix}:${date}`;
      this.store.dispatch(setFilter({name: this.filterName, filter: date ? this.prefixAndNumber : 'date'}))
    } else if (prefix === 'grade') {
      const ran = this.search.extractRangeFromString(query);
      this.prefixAndNumber = `${prefix}:${ran}`;
      this.store.dispatch(setFilter({name: this.filterName, filter: ran ? this.prefixAndNumber : 'grade'}))
    }
    return of(null);
  }

  updateDetails() {
    this.traineeService.onUpdateButton();
    // this.store.dispatch(setTraineeId({selectedTraineesId: '', subject: ''}))
  }

  ngOnDestroy(): void {
    this.subscribers.map(subscriber => subscriber.unsubscribe());
  }
}
