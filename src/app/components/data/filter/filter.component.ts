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

  searchControl = new FormControl();
  searchResults$!: Observable<any>;
  filter$: Observable<string>;

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private search: SearchService
  ) {

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
      switchMap(query => this.doSearch(query))
    ).subscribe(() => {
    });

  }

  ngOnInit(): void {
    this.subscription = this.filter$.subscribe(
      filter => this.searchControl.setValue(filter)
    );
  }

  traineeRemove() {
    this.store.dispatch(removeTrainee({id: this.currentTraineeId}));
    this.store.dispatch(setTraineeId({selectedTraineesId: ''}));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
    const prefix = this.search.getPrefix(query);
    if (prefix === 'id') {
      const num = this.search.extractNumberFromString(query);
      const prefixAndNumber = `${prefix}:${num}`;
      this.searchControl.setValue(prefixAndNumber)
      this.store.dispatch(setFilter({filter: num ? prefixAndNumber : ''}))
    } else if (prefix === 'date') {
      console.log("DATE", prefix)
    } else if (prefix === 'grade') {
      console.log("GRADE", prefix)
    }
    return of(null);
  }
}
