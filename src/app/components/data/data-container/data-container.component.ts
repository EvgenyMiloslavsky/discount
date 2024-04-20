import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TableComponent} from "../table/table.component";
import {DetailsComponent} from "../details/details.component";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {selectAllTrainees} from "../../../store/selectors";
import {Trainee} from "../../../models/trainee";
import {FilterComponent} from "../filter/filter.component";

@Component({
  selector: 'app-data-container',
  standalone: true,
  imports: [CommonModule, TableComponent, DetailsComponent, FilterComponent],
  templateUrl: './data-container.component.html',
  styleUrls: ['./data-container.component.scss']
})
export class DataContainerComponent{

  isLoaded$!: Observable<Trainee[]>;
  // isLoaded: boolean = false;

  constructor(private store: Store) {
    this.isLoaded$ = this.store.select(selectAllTrainees)
  }
}
