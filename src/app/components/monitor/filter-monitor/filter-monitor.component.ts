import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {debounceTime, distinctUntilChanged, Observable, Subscription, switchMap, tap} from "rxjs";
import {MonitorService} from "../../../services/monitor.service";
import {setFilter} from "../../../store/actions";
import {Store} from "@ngrx/store";
import {getFilter} from "../../../store/selectors";
import {StateFilter} from "../../../store/reducers";

@Component({
  selector: 'app-filter-monitor',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './filter-monitor.component.html',
  styleUrls: ['./filter-monitor.component.scss']
})
export class FilterMonitorComponent implements OnInit {
  idControl: FormControl = new FormControl();
  nameControl: FormControl = new FormControl();
  filterStateId$: Observable<StateFilter>;
  filterStateName$: Observable<StateFilter>;

  subscribers: Subscription[] = [];


  filterNameForId: string = 'monitorFilterId';
  filterNameForName: string = 'monitorFilterName';

  constructor(
    private monitorService: MonitorService,
    private store: Store) {
    this.filterStateId$ = this.store.select(getFilter(this.filterNameForId));
    this.filterStateName$ = this.store.select(getFilter(this.filterNameForName));
  }

  ngOnInit(): void {
    this.subscribers.push(
      this.filterStateId$.subscribe(
        filterState => {
          if (filterState) {
            this.monitorService.setIdFilter(filterState.filter);
            this.idControl.setValue(filterState.filter);
          }
        }
      ));

    this.subscribers.push(
      this.filterStateName$.subscribe(
        filterState => {
          if (filterState) {
            this.monitorService.setNameFilter(filterState.filter);
            this.nameControl.setValue(filterState.filter);
          }
        }
      ))

    this.idControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap(id => {
          this.monitorService.setIdFilter(id);
        }
      ),
      switchMap(val => {
        if (val !== '') {
          this.store.dispatch(setFilter({name: this.filterNameForId, filter: val}));
          return val
        } else {
          this.store.dispatch(setFilter({name: this.filterNameForId, filter: ''}));
          return ''
        }
      })
    ).subscribe();

    this.nameControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap(name =>
        this.monitorService.setNameFilter(name)
      ),
      switchMap(val => {
        if (val !== '') {
          this.store.dispatch(setFilter({name: this.filterNameForName, filter: val}));
          return val;
        } else {
          this.store.dispatch(setFilter({name: this.filterNameForName, filter: ''}));
          return ''
        }
      })
    ).subscribe()
  }

  onPassed(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.monitorService.setCheckboxPassStatus(isChecked)
  }

  onFailed(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.monitorService.setCheckboxFailStatus(isChecked)
  }
}
