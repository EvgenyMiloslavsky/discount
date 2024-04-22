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
        console.log("SER", this.searchValue)
        console.log("===>", (this.searchValue.replace(/\D/g, '')) === this.searchValue)
        console.log(`Updated searchKey to '${this.searchKey}' and searchValue to '${this.searchValue}'`);

        this.filterPredicates();
      } /*else {
        this.dataSource.filter = "";
      }*/
    }));

    this.subscribers.push(this.store.select(selectAllTrainees).subscribe(
      tr => {
        this.dataSource.data = tr;
        // this.dataSource.filter = this.searchValue.trim().toLowerCase();

        /* console.log("Search value", this.searchValue)
         console.log(`Updated dataSource with data:`, tr, `and filter: '${this.dataSource.filter}'`);*/
      }
    ));
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscribers.forEach(sub => sub.unsubscribe());
  }

  clickedRow(id: string) {
    this.selectedRowId = id;
    this.store.dispatch(setTraineeId({selectedTraineesId: id}));
  }

  createIdFilterPredicate<T>(searchKey: keyof T): (data: T, filter: string) => boolean {
    return (data: T, filter: string) => {
      return data[searchKey] ? data[searchKey].toString().toLowerCase().includes(filter.toLowerCase()) : false;
    };
  }

  createGradeFilterPredicate<T>(searchKey: keyof T): (data: T, filter: string) => boolean {
    return (data: T, filter: string) => {
      let lower = -Infinity, upper = Infinity;
      const lowerMatch = filter.match(/>(\d+)/);
      if (lowerMatch) {
        lower = Number(lowerMatch[1]);
      }
      const upperMatch = filter.match(/<(\d+)/);
      if (upperMatch) {
        upper = Number(upperMatch[1]);
      }

      const grade = Number(data[searchKey as keyof T]);
      return grade >= lower && grade <= upper;
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
    }, 30)
  }

  filterPredicates() {
    switch (this.searchKey) {
      case 'id':
        const customFilterPredicate = this.createIdFilterPredicate<any>(this.searchKey);
        this.dataSource.filterPredicate = (data, filter) => customFilterPredicate(data, filter);
        break;
      case 'grade':
        if ((this.searchValue.replace(/\D/g, '')) === this.searchValue) {
          const customFilterPredicate = this.createIdFilterPredicate<any>(this.searchKey);
          this.dataSource.filterPredicate = (data, filter) => customFilterPredicate(data, filter);
        } else {
          const customGradeFilterPredicate = this.createGradeFilterPredicate<any>(this.searchKey);
          this.dataSource.filterPredicate = (data, filter) => customGradeFilterPredicate(data, filter);
        }
        console.log("Grade", this.searchKey);
        break;
      case 'Date':
        console.log("Date", this.searchKey);
        break;
    }

  }
}
