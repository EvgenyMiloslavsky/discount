import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {Store} from "@ngrx/store";
import {Trainee} from "../../../models/trainee";
import {Subscription} from "rxjs";
import {getFilter, selectAllTrainees} from "../../../store/selectors";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {setTraineeId} from "../../../store/actions";

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatProgressSpinnerModule, MatPaginatorModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  subscribers: Subscription[] = [];
  selectedRowId!: string;
  searchKey: string = '';
  searchValue: string = '';

  //-- Represents an Observable that emits an array of Trainee objects.
  displayedColumns: string[] = ['id', 'name', 'date', 'grade', 'subject'];
  dataSource: MatTableDataSource<Trainee> = new MatTableDataSource<Trainee>();

  constructor(private store: Store,) {
    this.subscribers.push(this.store.select(getFilter).subscribe(fi => {
      if (fi) {
        const [key, value] = fi.split(':');
        this.searchKey = key;
        this.searchValue = value;
        this.dataSource.filter = this.searchValue.trim().toLowerCase();
        console.log(`Updated searchKey to '${this.searchKey}' and searchValue to '${this.searchValue}'`);
      } else {
        this.searchValue = '';
      }
    }));

    this.subscribers.push(this.store.select(selectAllTrainees).subscribe(
      tr => {
        this.dataSource.data = tr;
        this.dataSource.filter = this.searchValue.trim().toLowerCase();

        console.log("Search value", this.searchValue)
        console.log(`Updated dataSource with data:`, tr, `and filter: '${this.dataSource.filter}'`);
      }
    ));
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscribers.forEach(sub => sub.unsubscribe());
  }

  clickedRow(id: string) {
    this.store.dispatch(setTraineeId({selectedTraineesId: id}))
  }

  createIdFilterPredicate<T>(searchKey: keyof T): (data: T, filter: string) => boolean {
    return (data: T, filter: string) => {
      return data[searchKey] ? data[searchKey].toString().toLowerCase().includes(filter.toLowerCase()) : false;
    };
  }

 /* createGradeFilterPredicate<T>(searchKey: keyof T): (data: T, filter: string) => boolean {
    return (data: T, filter: string) => {
      const [lower, upper] = filter.split('-').map(Number);
      const grade = Number(data['grade']);
      return grade >= lower && grade <= upper;
    }
  }*/

  ngAfterViewInit(): void {
    setTimeout(() => {
        const customFilterPredicate = this.createIdFilterPredicate<any>(this.searchKey);
        this.dataSource.filterPredicate = (data, filter) => customFilterPredicate(data, filter);

        console.log(`Set up paginator and custom filter predicate for dataSource`);
      }, 4000
    )

    setTimeout(() => {
      this.dataSource.paginator = this.paginator;

    }, 100)
  }
}
